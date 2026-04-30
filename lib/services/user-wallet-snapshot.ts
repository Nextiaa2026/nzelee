import { and, desc, eq, inArray, sum } from "drizzle-orm";

import { db } from "@/lib/db";
import { paymentTransactions, withdrawalRequests } from "@/lib/db/schema";

const WALLET_CREDIT_TYPES = ["ADJUSTMENT", "REFUND", "CREATOR_PAYOUT"] as const;

export type UserWalletSnapshot = {
  currency: string;
  availableCents: number;
  pendingWithdrawalCents: number;
  lifetimeCreditsCents: number;
  lifetimeWithdrawnCents: number;
};

/**
 * In-app wallet: succeeded credits to the user (payouts, refunds, adjustments)
 * minus completed withdrawals. Pending withdrawals are reported separately for UI.
 */
export async function getUserWalletSnapshot(userId: string): Promise<UserWalletSnapshot> {
  const [creditRow] = await db
    .select({ total: sum(paymentTransactions.amount) })
    .from(paymentTransactions)
    .where(
      and(
        eq(paymentTransactions.payeeUserId, userId),
        eq(paymentTransactions.status, "SUCCEEDED"),
        inArray(paymentTransactions.type, [...WALLET_CREDIT_TYPES]),
      ),
    );

  const [pendingWd] = await db
    .select({ total: sum(withdrawalRequests.amount) })
    .from(withdrawalRequests)
    .where(
      and(
        eq(withdrawalRequests.userId, userId),
        inArray(withdrawalRequests.status, ["PENDING", "APPROVED"]),
      ),
    );

  const [completedWd] = await db
    .select({ total: sum(withdrawalRequests.amount) })
    .from(withdrawalRequests)
    .where(
      and(eq(withdrawalRequests.userId, userId), eq(withdrawalRequests.status, "COMPLETED")),
    );

  const credits = Number(creditRow?.total ?? 0);
  const withdrawn = Number(completedWd?.total ?? 0);
  const availableCents = Math.max(0, credits - withdrawn);

  const [currencyRow] = await db
    .select({ currency: withdrawalRequests.currency })
    .from(withdrawalRequests)
    .where(eq(withdrawalRequests.userId, userId))
    .orderBy(desc(withdrawalRequests.requestedAt))
    .limit(1);

  return {
    currency: currencyRow?.currency ?? "USD",
    availableCents,
    pendingWithdrawalCents: Number(pendingWd?.total ?? 0),
    lifetimeCreditsCents: credits,
    lifetimeWithdrawnCents: withdrawn,
  };
}
