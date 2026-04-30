import { and, count, eq, isNull, sum } from "drizzle-orm";

import { db } from "@/lib/db";
import { campaigns, notifications, pledges, withdrawalRequests } from "@/lib/db/schema";

export async function getUserAccountSummary(userId: string) {
  const [myCampaigns] = await db
    .select({ total: count() })
    .from(campaigns)
    .where(eq(campaigns.creatorId, userId));

  const [myInvestments] = await db
    .select({ total: count(), amount: sum(pledges.amount) })
    .from(pledges)
    .where(eq(pledges.backerId, userId));

  const [unreadNotifications] = await db
    .select({ total: count() })
    .from(notifications)
    .where(and(eq(notifications.userId, userId), isNull(notifications.readAt)));

  const [pendingWithdrawals] = await db
    .select({ total: count() })
    .from(withdrawalRequests)
    .where(and(eq(withdrawalRequests.userId, userId), eq(withdrawalRequests.status, "PENDING")));

  return {
    campaigns: Number(myCampaigns?.total ?? 0),
    investments: Number(myInvestments?.total ?? 0),
    investedAmount: Number(myInvestments?.amount ?? 0),
    unreadNotifications: Number(unreadNotifications?.total ?? 0),
    pendingWithdrawals: Number(pendingWithdrawals?.total ?? 0),
  };
}
