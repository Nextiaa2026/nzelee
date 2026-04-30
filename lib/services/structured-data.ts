import { db } from "@/lib/db";
import { campaigns, users, pledges, campaignReviews } from "@/lib/db/schema";
import { sql, count, sum, avg, eq } from "drizzle-orm";

export interface StructuredDataStats {
  totalCampaigns: number;
  totalInvestors: number;
  totalRaised: number;
  activeCampaigns: number;
  averageRating: number;
  totalReviews: number;
  minInvestment: number;
  maxInvestment: number;
}

/**
 * Fetch platform statistics for structured data from database
 * Primary currency: XAF (Central African CFA franc)
 */
export async function getStructuredDataStats(): Promise<StructuredDataStats> {
  try {
    // Get total campaigns
    const [campaignsResult] = await db
      .select({ count: count() })
      .from(campaigns);

    // Get active campaigns (LIVE status)
    const [activeCampaignsResult] = await db
      .select({ count: count() })
      .from(campaigns)
      .where(eq(campaigns.status, "LIVE"));

    // Get total unique investors (users who have made pledges)
    const [investorsResult] = await db
      .select({ count: sql<number>`COUNT(DISTINCT ${pledges.backerId})` })
      .from(pledges);

    // Get total amount raised across all campaigns (in smallest currency unit - cents)
    const [raisedResult] = await db
      .select({ total: sum(campaigns.raisedAmount) })
      .from(campaigns);

    // Get average rating from campaign reviews
    const [ratingResult] = await db
      .select({
        avgRating: avg(campaignReviews.rating),
        totalReviews: count(),
      })
      .from(campaignReviews);

    // Get min and max goal amounts for investment range
    const [investmentRangeResult] = await db
      .select({
        minGoal: sql<number>`MIN(${campaigns.goalAmount})`,
        maxGoal: sql<number>`MAX(${campaigns.goalAmount})`,
      })
      .from(campaigns)
      .where(eq(campaigns.status, "LIVE"));

    return {
      totalCampaigns: campaignsResult?.count ?? 0,
      totalInvestors: investorsResult?.count ?? 0,
      totalRaised: Number(raisedResult?.total ?? 0),
      activeCampaigns: activeCampaignsResult?.count ?? 0,
      averageRating: Number(ratingResult?.avgRating ?? 4.5),
      totalReviews: ratingResult?.totalReviews ?? 0,
      minInvestment: Number(investmentRangeResult?.minGoal ?? 10000), // 100 XAF in cents
      maxInvestment: Number(investmentRangeResult?.maxGoal ?? 100000000), // 1,000,000 XAF in cents
    };
  } catch (error) {
    console.error("Error fetching structured data stats:", error);
    // Return default values on error
    return {
      totalCampaigns: 0,
      totalInvestors: 0,
      totalRaised: 0,
      activeCampaigns: 0,
      averageRating: 4.5,
      totalReviews: 0,
      minInvestment: 10000, // 100 XAF
      maxInvestment: 100000000, // 1,000,000 XAF
    };
  }
}
