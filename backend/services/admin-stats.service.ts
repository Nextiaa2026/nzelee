import { and, count, eq, gte, inArray, sum } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  campaigns,
  paymentTransactions,
  pledges,
  users,
  withdrawalRequests,
} from "@/lib/db/schema";

function rangeToFromDate(range: "30d" | "90d" | "6m" | "1y"): Date {
  const d = new Date();
  if (range === "30d") d.setDate(d.getDate() - 30);
  else if (range === "90d") d.setDate(d.getDate() - 90);
  else if (range === "6m") d.setMonth(d.getMonth() - 6);
  else d.setFullYear(d.getFullYear() - 1);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/** Summary aggregates for admin dashboard. */
export async function getAdminStatsSummary() {
  const [userCount] = await db.select({ n: count() }).from(users);
  const byRole = await db
    .select({ role: users.role, n: count() })
    .from(users)
    .groupBy(users.role);

  const [campaignCount] = await db.select({ n: count() }).from(campaigns);
  const byCampaignStatus = await db
    .select({ status: campaigns.status, n: count() })
    .from(campaigns)
    .groupBy(campaigns.status);

  const [pledgeCount] = await db.select({ n: count() }).from(pledges);
  const byPledgeStatus = await db
    .select({ status: pledges.status, n: count() })
    .from(pledges)
    .groupBy(pledges.status);

  const [wrCount] = await db.select({ n: count() }).from(withdrawalRequests);
  const byWrStatus = await db
    .select({ status: withdrawalRequests.status, n: count() })
    .from(withdrawalRequests)
    .groupBy(withdrawalRequests.status);

  const [txCount] = await db.select({ n: count() }).from(paymentTransactions);
  const byTxStatus = await db
    .select({ status: paymentTransactions.status, n: count() })
    .from(paymentTransactions)
    .groupBy(paymentTransactions.status);

  const [paidPledgesSum] = await db
    .select({ total: sum(pledges.amount) })
    .from(pledges)
    .where(eq(pledges.status, "PAID"));

  const [txVolume] = await db
    .select({ total: sum(paymentTransactions.amount) })
    .from(paymentTransactions)
    .where(
      and(
        eq(paymentTransactions.status, "SUCCEEDED"),
        inArray(paymentTransactions.type, ["PLEDGE_CAPTURE", "PLATFORM_FEE"]),
      ),
    );

  const [pendingWr] = await db
    .select({ n: count() })
    .from(withdrawalRequests)
    .where(eq(withdrawalRequests.status, "PENDING"));
  const [pendingPl] = await db
    .select({ n: count() })
    .from(pledges)
    .where(eq(pledges.status, "PENDING"));

  return {
    users: {
      total: Number(userCount?.n ?? 0),
      byRole: Object.fromEntries(byRole.map((r) => [r.role, Number(r.n)])),
    },
    campaigns: {
      total: Number(campaignCount?.n ?? 0),
      byStatus: Object.fromEntries(byCampaignStatus.map((r) => [r.status, Number(r.n)])),
    },
    pledges: {
      total: Number(pledgeCount?.n ?? 0),
      byStatus: Object.fromEntries(byPledgeStatus.map((r) => [r.status, Number(r.n)])),
    },
    withdrawalRequests: {
      total: Number(wrCount?.n ?? 0),
      byStatus: Object.fromEntries(byWrStatus.map((r) => [r.status, Number(r.n)])),
    },
    paymentTransactions: {
      total: Number(txCount?.n ?? 0),
      byStatus: Object.fromEntries(byTxStatus.map((r) => [r.status, Number(r.n)])),
    },
    totalPaidPledgeAmount: paidPledgesSum?.total != null ? String(paidPledgesSum.total) : "0",
    totalSucceededRelevantTxAmount: txVolume?.total != null ? String(txVolume.total) : "0",
    pipeline: {
      pendingWithdrawals: Number(pendingWr?.n ?? 0),
      pendingPledges: Number(pendingPl?.n ?? 0),
    },
  };
}

export type TimeseriesPoint = {
  date: string;
  /** Paid pledge volume (smallest unit). */
  pledged: string;
  /** Succeeded PLEDGE_CAPTURE+PLATFORM_FEE. */
  transactionVolume: string;
};

export async function getAdminStatsTimeseries(
  range: "30d" | "90d" | "6m" | "1y",
): Promise<TimeseriesPoint[]> {
  const from = rangeToFromDate(range);

  const paidPledges = await db
    .select()
    .from(pledges)
    .where(and(eq(pledges.status, "PAID"), gte(pledges.createdAt, from)));

  const relevantTx = await db
    .select()
    .from(paymentTransactions)
    .where(
      and(
        eq(paymentTransactions.status, "SUCCEEDED"),
        inArray(paymentTransactions.type, ["PLEDGE_CAPTURE", "PLATFORM_FEE"]),
        gte(paymentTransactions.createdAt, from),
      ),
    );

  const pledgeByDay = new Map<string, number>();
  for (const p of paidPledges) {
    const d = p.createdAt instanceof Date ? p.createdAt : new Date(p.createdAt);
    const key = d.toISOString().slice(0, 10);
    pledgeByDay.set(key, (pledgeByDay.get(key) ?? 0) + p.amount);
  }
  const txByDay = new Map<string, number>();
  for (const t of relevantTx) {
    const d = t.createdAt instanceof Date ? t.createdAt : new Date(t.createdAt);
    const key = d.toISOString().slice(0, 10);
    txByDay.set(key, (txByDay.get(key) ?? 0) + t.amount);
  }
  const allDays = new Set([...pledgeByDay.keys(), ...txByDay.keys()]);
  const end = new Date();
  for (let d = new Date(from); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    allDays.add(d.toISOString().slice(0, 10));
  }
  const sorted = [...allDays].sort();
  return sorted.map((date) => ({
    date,
    pledged: String(pledgeByDay.get(date) ?? 0),
    transactionVolume: String(txByDay.get(date) ?? 0),
  }));
}
