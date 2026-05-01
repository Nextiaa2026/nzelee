import { randomUUID } from "node:crypto";

import { desc, eq, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { campaigns, paymentTransactions, pledges, users } from "@/lib/db/schema";
import { investmentCurrencyCodes } from "@/lib/validations/user-investment";

import { NotchPayService } from "./notchpay.service";
import { PaymentTransactionService } from "./payment-transaction.service";
import { PledgeService } from "./pledge.service";

const zeroDecimalCurrencies = new Set(["XAF", "JPY"]);
const supportedCurrencies = new Set<string>(investmentCurrencyCodes);

function minorFactor(currency: string) {
  return zeroDecimalCurrencies.has(currency.toUpperCase()) ? 1 : 100;
}

function toMajorAmount(minorAmount: number, currency: string) {
  const f = minorFactor(currency);
  return f === 1 ? minorAmount : minorAmount / f;
}

function appBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXTAUTH_URL ??
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

export function defaultNotchCallbackUrl() {
  return `${appBaseUrl()}/dashboard/investments?payment=callback`;
}

const paymentTxService = new PaymentTransactionService();
const pledgeSvc = new PledgeService();

export type NotchCheckoutResult = {
  authorizationUrl: string;
  reference: string;
  paymentTransactionId: string;
  notchPayTransactionId: string;
};

/**
 * Starts (or restarts) a Notch Pay hosted checkout for an existing pledge.
 * Uses amounts and currency from the latest payment row (tamper-resistant).
 */
export async function startNotchCheckoutForPledge(
  userId: string,
  pledgeId: string,
  options?: { callbackUrl?: string },
): Promise<NotchCheckoutResult> {
  const pledge = await pledgeSvc.getPledgeById(pledgeId);
  if (!pledge || pledge.backerId !== userId) {
    throw new Error("Investment not found.");
  }

  if (pledge.status === "PAID" || pledge.status === "REFUNDED") {
    throw new Error("This investment is already settled.");
  }

  if (pledge.status === "FAILED") {
    await pledgeSvc.updatePledgeStatus(pledgeId, "PENDING");
  }

  const [latestTx] = await db
    .select()
    .from(paymentTransactions)
    .where(eq(paymentTransactions.pledgeId, pledgeId))
    .orderBy(desc(paymentTransactions.createdAt))
    .limit(1);

  if (!latestTx) {
    throw new Error("No payment record for this investment.");
  }

  if (latestTx.status === "SUCCEEDED") {
    throw new Error("Payment already completed.");
  }

  const checkoutProviders = new Set(["notchpay", "orange_money", "mobile_money"]);
  if (!checkoutProviders.has(latestTx.provider)) {
    throw new Error("This investment uses a payment channel that cannot open Notch Pay checkout.");
  }

  if (latestTx.provider !== "notchpay") {
    await db
      .update(paymentTransactions)
      .set({ provider: "notchpay", updatedAt: new Date() })
      .where(eq(paymentTransactions.id, latestTx.id));
  }

  const [userRow] = await db
    .select({ email: users.email, name: users.name })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const email = userRow?.email?.trim() || "";
  if (!email) {
    throw new Error("Your account needs an email address to pay online.");
  }

  const reference = `inv-${pledgeId}-${Date.now()}`;
  const idempotencyKey = `notchpay-${reference}-${randomUUID().slice(0, 8)}`;

  await db
    .update(paymentTransactions)
    .set({
      providerRef: reference,
      status: "PENDING",
      idempotencyKey,
      updatedAt: new Date(),
    })
    .where(eq(paymentTransactions.id, latestTx.id));

  const notch = new NotchPayService();
  const major = toMajorAmount(latestTx.amount, latestTx.currency);
  if (!supportedCurrencies.has(latestTx.currency.toUpperCase())) {
    throw new Error(`Unsupported currency for checkout: ${latestTx.currency}`);
  }

  const paymentResponse = await notch.initializePayment({
    amount: major,
    currency: latestTx.currency.toUpperCase(),
    reference,
    description: `Campaign investment ${pledgeId.slice(0, 8)}…`,
    email,
    customerName: userRow?.name ?? undefined,
    callback_url: options?.callbackUrl ?? defaultNotchCallbackUrl(),
  });

  await paymentTxService.updateTransactionStatus(
    latestTx.id,
    "PENDING",
    paymentResponse.transaction.id,
  );

  const notchRef = paymentResponse.transaction.reference || paymentResponse.transaction.id;
  await db
    .update(paymentTransactions)
    .set({
      metadata: {
        ...(latestTx.metadata && typeof latestTx.metadata === "object"
          ? latestTx.metadata
          : {}),
        notchPayTransactionId: paymentResponse.transaction.id,
        notchPayReference: notchRef,
      },
      updatedAt: new Date(),
    })
    .where(eq(paymentTransactions.id, latestTx.id));

  if (!paymentResponse.authorization_url) {
    throw new Error("Payment provider did not return a checkout URL.");
  }

  return {
    authorizationUrl: paymentResponse.authorization_url,
    reference,
    paymentTransactionId: latestTx.id,
    notchPayTransactionId: paymentResponse.transaction.id,
  };
}

export async function reverseInvestmentCheckoutFailure(
  pledgeId: string,
): Promise<void> {
  const pledge = await pledgeSvc.getPledgeById(pledgeId);
  if (!pledge) return;

  const [latestTx] = await db
    .select()
    .from(paymentTransactions)
    .where(eq(paymentTransactions.pledgeId, pledgeId))
    .orderBy(desc(paymentTransactions.createdAt))
    .limit(1);

  await db.transaction(async (trx) => {
    if (latestTx?.status === "PENDING" || latestTx?.status === "PROCESSING") {
      await trx
        .update(paymentTransactions)
        .set({ status: "FAILED", updatedAt: new Date() })
        .where(eq(paymentTransactions.id, latestTx.id));
    }

    await trx
      .update(pledges)
      .set({ status: "FAILED" })
      .where(eq(pledges.id, pledgeId));

    await trx
      .update(campaigns)
      .set({
        raisedAmount: sql`GREATEST(0, ${campaigns.raisedAmount} - ${pledge.amount})`,
        updatedAt: new Date(),
      })
      .where(eq(campaigns.id, pledge.campaignId));
  });
}

export async function applyNotchWebhookOrPollStatus(
  reference: string,
  rawStatus: string,
  providerTxnId?: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const normalized = rawStatus.toLowerCase();
  const tx =
    (await paymentTxService.getTransactionByExternalRef(reference)) ??
    (providerTxnId
      ? await paymentTxService.getTransactionByExternalRef(providerTxnId)
      : null);
  if (!tx?.pledgeId) {
    return { ok: false, message: "Transaction not found" };
  }

  const pledge = await pledgeSvc.getPledgeById(tx.pledgeId);
  if (!pledge) {
    return { ok: false, message: "Pledge not found" };
  }

  if (tx.status === "SUCCEEDED" && normalized === "complete") {
    return { ok: true };
  }

  if (
    (tx.status === "FAILED" || tx.status === "CANCELED") &&
    (normalized === "failed" || normalized === "cancelled")
  ) {
    return { ok: true };
  }

  if (
    (tx.status === "FAILED" || tx.status === "CANCELED") &&
    normalized === "complete"
  ) {
    return { ok: true };
  }

  const newTxStatus =
    normalized === "complete"
      ? ("SUCCEEDED" as const)
      : normalized === "failed"
        ? ("FAILED" as const)
        : normalized === "cancelled"
          ? ("CANCELED" as const)
          : ("PENDING" as const);

  const pledgeStatus = pledgeSvc.mapPaymentStatusToPledgeStatus(normalized);

  if (newTxStatus === "FAILED" || newTxStatus === "CANCELED") {
    if (pledge.status === "PENDING") {
      await db
        .update(campaigns)
        .set({
          raisedAmount: sql`GREATEST(0, ${campaigns.raisedAmount} - ${pledge.amount})`,
          updatedAt: new Date(),
        })
        .where(eq(campaigns.id, tx.campaignId));
    }
  }

  await paymentTxService.updateTransactionStatus(
    tx.id,
    newTxStatus,
    providerTxnId,
  );

  if (pledgeStatus && pledgeStatus !== pledge.status) {
    await pledgeSvc.updatePledgeStatus(tx.pledgeId, pledgeStatus);
  }

  return { ok: true };
}
