import { and, desc, eq, inArray, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { campaigns, paymentTransactions, pledges } from "@/lib/db/schema";
import type { UserCreateInvestmentBody } from "@/lib/validations/user-investment";
import { investmentCurrencyCodes } from "@/lib/validations/user-investment";

type UserInvestmentRow = {
  id: string;
  campaignId: string;
  campaignTitle: string;
  campaignSlug: string;
  amount: number;
  currency: string;
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  createdAt: Date;
  paymentStatus: string | null;
  canOpenCheckout: boolean;
};

const zeroDecimalCurrencies = new Set(["XAF", "JPY"]);
const supportedCurrencies = new Set<string>(investmentCurrencyCodes);

function minorFactor(currency: string) {
  return zeroDecimalCurrencies.has(currency.toUpperCase()) ? 1 : 100;
}

function isSupportedCurrency(value: string) {
  return supportedCurrencies.has(value.toUpperCase());
}

let cachedUsdRates: { rates: Record<string, number>; expiresAt: number } | null = null;

async function getUsdRates() {
  const now = Date.now();
  if (cachedUsdRates && cachedUsdRates.expiresAt > now) return cachedUsdRates.rates;

  const res = await fetch("https://open.er-api.com/v6/latest/USD");
  if (!res.ok) throw new Error("Unable to fetch exchange rates");
  const data = (await res.json()) as {
    result?: string;
    rates?: Record<string, number>;
  };
  if (data.result !== "success" || !data.rates) {
    throw new Error("Invalid exchange-rate payload");
  }
  const rates = { USD: 1, ...data.rates };
  cachedUsdRates = { rates, expiresAt: now + 60 * 60 * 1000 };
  return rates;
}

function convertMinorAmount(amount: number, fromCurrency: string, toCurrency: string, rates: Record<string, number>) {
  const from = fromCurrency.toUpperCase();
  const to = toCurrency.toUpperCase();
  if (from === to) return amount;

  const fromRate = from === "USD" ? 1 : rates[from];
  const toRate = to === "USD" ? 1 : rates[to];
  if (!fromRate || !toRate) {
    throw new Error(`Conversion unavailable for ${from} -> ${to}`);
  }

  const fromMajor = amount / minorFactor(from);
  const usdMajor = from === "USD" ? fromMajor : fromMajor / fromRate;
  const targetMajor = to === "USD" ? usdMajor : usdMajor * toRate;
  return Math.round(targetMajor * minorFactor(to));
}

async function resolveCampaign(campaignRef: string) {
  const [row] = await db
    .select({
      id: campaigns.id,
      title: campaigns.title,
      slug: campaigns.slug,
      creatorId: campaigns.creatorId,
      currency: campaigns.currency,
      status: campaigns.status,
    })
    .from(campaigns)
    // Cast UUID to text so slug refs never trigger UUID parse errors.
    .where(sql`(${campaigns.id}::text = ${campaignRef} or ${campaigns.slug} = ${campaignRef})`)
    .limit(1);
  return row ?? null;
}

export async function listInvestmentsForUser(userId: string): Promise<UserInvestmentRow[]> {
  const rows = await db
    .select({
      id: pledges.id,
      campaignId: pledges.campaignId,
      campaignTitle: campaigns.title,
      campaignSlug: campaigns.slug,
      amount: pledges.amount,
      currency: campaigns.currency,
      status: pledges.status,
      createdAt: pledges.createdAt,
    })
    .from(pledges)
    .innerJoin(campaigns, eq(pledges.campaignId, campaigns.id))
    .where(eq(pledges.backerId, userId))
    .orderBy(desc(pledges.createdAt));

  const pledgeIds = rows.map((r) => r.id);
  if (pledgeIds.length === 0) return [];

  const txs = await db
    .select()
    .from(paymentTransactions)
    .where(inArray(paymentTransactions.pledgeId, pledgeIds))
    .orderBy(desc(paymentTransactions.createdAt));

  const latestByPledge = new Map<string, (typeof txs)[number]>();
  for (const t of txs) {
    if (t.pledgeId && !latestByPledge.has(t.pledgeId)) {
      latestByPledge.set(t.pledgeId, t);
    }
  }

  const checkoutProviders = new Set(["notchpay", "orange_money", "mobile_money"]);

  return rows.map((r) => {
    const pt = latestByPledge.get(r.id);
    const paymentStatus = pt?.status ?? null;
    const canOpenCheckout =
      (r.status === "PENDING" || r.status === "FAILED") &&
      pt != null &&
      paymentStatus !== "SUCCEEDED" &&
      checkoutProviders.has(pt.provider);

    return {
      ...r,
      paymentStatus,
      canOpenCheckout,
    };
  });
}

export async function createInvestmentForUser(userId: string, input: UserCreateInvestmentBody) {
  const campaign = await resolveCampaign(input.campaignRef);
  if (!campaign) {
    throw new Error("Campaign not found.");
  }
  if (campaign.creatorId === userId) {
    throw new Error("You cannot invest in your own campaign.");
  }
  if (campaign.status !== "LIVE") {
    throw new Error("This campaign is not accepting investments right now.");
  }
  const sourceCurrency = input.sourceCurrency.toUpperCase();
  const campaignCurrency = campaign.currency.toUpperCase();

  if (!isSupportedCurrency(sourceCurrency)) {
    throw new Error(`Unsupported source currency: ${sourceCurrency}`);
  }
  if (!isSupportedCurrency(campaignCurrency)) {
    throw new Error(`Unsupported campaign currency: ${campaign.currency}`);
  }

  const rates = await getUsdRates();
  const convertedAmount = convertMinorAmount(
    input.amount,
    sourceCurrency,
    campaignCurrency,
    rates,
  );

  const [pledgeRow] = await db.transaction(async (tx) => {
    const [insertedPledge] = await tx
      .insert(pledges)
      .values({
        campaignId: campaign.id,
        backerId: userId,
        amount: convertedAmount,
        status: "PENDING",
      })
      .returning();

    if (!insertedPledge) {
      throw new Error("Failed to create investment.");
    }

    await tx.insert(paymentTransactions).values({
      campaignId: campaign.id,
      pledgeId: insertedPledge.id,
      payerUserId: userId,
      payeeUserId: campaign.creatorId,
      type: "PLEDGE_CAPTURE",
      status: "PENDING",
      amount: convertedAmount,
      currency: campaign.currency,
      provider: "notchpay",
      providerRef: null,
      description:
        input.note?.trim() ||
        `Investment via Notch Pay (${input.paymentMethod === "ORANGE_MONEY" ? "Orange Money" : "Mobile Money"} intent)`,
      metadata: {
        paymentMethod: input.paymentMethod,
        sourceCurrency: input.sourceCurrency,
      },
    });

    await tx
      .update(campaigns)
      .set({
        raisedAmount: sql`${campaigns.raisedAmount} + ${convertedAmount}`,
        updatedAt: new Date(),
      })
      .where(and(eq(campaigns.id, campaign.id)));

    return [insertedPledge] as const;
  });

  if (!pledgeRow) {
    throw new Error("Failed to create investment.");
  }

  return pledgeRow;
}
