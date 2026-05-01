import { and, desc, eq, inArray, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { campaignReviews, campaigns, pledges, users } from "@/lib/db/schema";

function isMissingFeaturedColumnError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "42703"
  );
}

export type PublicCampaignBrowseRow = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  coverImageUrl: string | null;
  goalAmount: number;
  raisedAmount: number;
  currency: string;
  isFeatured: boolean;
  status: (typeof campaigns.$inferSelect)["status"];
};

export type PublicCampaignInvestorRow = {
  rank: number;
  userId: string;
  name: string;
  initials: string;
  amount: number;
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
};

export type PublicCampaignDetails = PublicCampaignBrowseRow & {
  description: string;
  locationLabel: string | null;
  activitySector: string | null;
  projectOwner: string | null;
  isVerified: boolean;
  minimumInvestmentAmount: number | null;
  targetReturnRate: number | null;
  durationMonths: number | null;
  galleryImages: Array<{ url: string; alt?: string }>;
  impactPoints: string[];
  startsAt: Date | null;
  endsAt: Date | null;
  investors: PublicCampaignInvestorRow[];
  reviews: {
    id: string;
    rating: number;
    comment: string;
    createdAt: Date;
    userName: string;
  }[];
};

/** Campaigns visible on the public browse page (live or successfully funded). */
export async function listBrowseableCampaigns(): Promise<PublicCampaignBrowseRow[]> {
  try {
    return await db
      .select({
        id: campaigns.id,
        title: campaigns.title,
        slug: campaigns.slug,
        summary: campaigns.summary,
        coverImageUrl: campaigns.coverImageUrl,
        goalAmount: campaigns.goalAmount,
        raisedAmount: campaigns.raisedAmount,
        currency: campaigns.currency,
        isFeatured: campaigns.isFeatured,
        status: campaigns.status,
      })
      .from(campaigns)
      .where(inArray(campaigns.status, ["LIVE", "FUNDED"]))
      .orderBy(desc(campaigns.isFeatured), desc(campaigns.updatedAt))
      .limit(48);
  } catch (error) {
    if (!isMissingFeaturedColumnError(error)) throw error;
    return db
      .select({
        id: campaigns.id,
        title: campaigns.title,
        slug: campaigns.slug,
        summary: campaigns.summary,
        coverImageUrl: campaigns.coverImageUrl,
        goalAmount: campaigns.goalAmount,
        raisedAmount: campaigns.raisedAmount,
        currency: campaigns.currency,
        isFeatured: sql<boolean>`false`,
        status: campaigns.status,
      })
      .from(campaigns)
      .where(inArray(campaigns.status, ["LIVE", "FUNDED"]))
      .orderBy(desc(campaigns.updatedAt))
      .limit(48);
  }
}

function initialsFromName(name: string) {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export async function getPublicCampaignBySlug(
  slug: string,
): Promise<PublicCampaignDetails | null> {
  let campaign:
    | {
        id: string;
        title: string;
        slug: string;
        summary: string;
        description: string;
        locationLabel: string | null;
        activitySector: string | null;
        projectOwner: string | null;
        isVerified: boolean;
        minimumInvestmentAmount: number | null;
        targetReturnRate: number | null;
        durationMonths: number | null;
        galleryImages: Array<{ url: string; alt?: string }> | null;
        impactPoints: string[] | null;
        coverImageUrl: string | null;
        goalAmount: number;
        raisedAmount: number;
        currency: string;
        isFeatured: boolean;
        status: (typeof campaigns.$inferSelect)["status"];
        startsAt: Date | null;
        endsAt: Date | null;
      }
    | undefined;
  try {
    [campaign] = await db
      .select({
        id: campaigns.id,
        title: campaigns.title,
        slug: campaigns.slug,
        summary: campaigns.summary,
        description: campaigns.description,
        locationLabel: campaigns.locationLabel,
        activitySector: campaigns.activitySector,
        projectOwner: campaigns.projectOwner,
        isVerified: campaigns.isVerified,
        minimumInvestmentAmount: campaigns.minimumInvestmentAmount,
        targetReturnRate: campaigns.targetReturnRate,
        durationMonths: campaigns.durationMonths,
        galleryImages: campaigns.galleryImages,
        impactPoints: campaigns.impactPoints,
        coverImageUrl: campaigns.coverImageUrl,
        goalAmount: campaigns.goalAmount,
        raisedAmount: campaigns.raisedAmount,
        currency: campaigns.currency,
        isFeatured: campaigns.isFeatured,
        status: campaigns.status,
        startsAt: campaigns.startsAt,
        endsAt: campaigns.endsAt,
      })
      .from(campaigns)
      .where(and(eq(campaigns.slug, slug), inArray(campaigns.status, ["LIVE", "FUNDED"])))
      .limit(1);
  } catch (error) {
    if (!isMissingFeaturedColumnError(error)) throw error;
    [campaign] = await db
      .select({
        id: campaigns.id,
        title: campaigns.title,
        slug: campaigns.slug,
        summary: campaigns.summary,
        description: campaigns.description,
        locationLabel: campaigns.locationLabel,
        activitySector: campaigns.activitySector,
        projectOwner: campaigns.projectOwner,
        isVerified: campaigns.isVerified,
        minimumInvestmentAmount: campaigns.minimumInvestmentAmount,
        targetReturnRate: campaigns.targetReturnRate,
        durationMonths: campaigns.durationMonths,
        galleryImages: campaigns.galleryImages,
        impactPoints: campaigns.impactPoints,
        coverImageUrl: campaigns.coverImageUrl,
        goalAmount: campaigns.goalAmount,
        raisedAmount: campaigns.raisedAmount,
        currency: campaigns.currency,
        isFeatured: sql<boolean>`false`,
        status: campaigns.status,
        startsAt: campaigns.startsAt,
        endsAt: campaigns.endsAt,
      })
      .from(campaigns)
      .where(and(eq(campaigns.slug, slug), inArray(campaigns.status, ["LIVE", "FUNDED"])))
      .limit(1);
  }

  if (!campaign) return null;

  const investorRows = await db
    .select({
      userId: users.id,
      name: users.name,
      email: users.email,
      amount: sql<number>`sum(${pledges.amount})::int`,
      paidCount: sql<number>`sum(case when ${pledges.status} = 'PAID' then 1 else 0 end)::int`,
    })
    .from(pledges)
    .innerJoin(users, eq(pledges.backerId, users.id))
    .where(eq(pledges.campaignId, campaign.id))
    .groupBy(users.id, users.name, users.email)
    .orderBy(desc(sql<number>`sum(${pledges.amount})::int`))
    .limit(50);

  const investors: PublicCampaignInvestorRow[] = investorRows.map((row, idx) => {
    const displayName = row.name?.trim() || row.email.split("@")[0] || "Investor";
    return {
      rank: idx + 1,
      userId: row.userId,
      name: displayName,
      initials: initialsFromName(displayName),
      amount: row.amount,
      status: row.paidCount > 0 ? "PAID" : "PENDING",
    };
  });

  const reviewsRows = await db
    .select({
      id: campaignReviews.id,
      rating: campaignReviews.rating,
      comment: campaignReviews.comment,
      createdAt: campaignReviews.createdAt,
      userName: users.name,
      userEmail: users.email,
    })
    .from(campaignReviews)
    .innerJoin(users, eq(campaignReviews.userId, users.id))
    .where(eq(campaignReviews.campaignId, campaign.id))
    .orderBy(desc(campaignReviews.createdAt))
    .limit(50);

  return {
    ...campaign,
    galleryImages: (campaign.galleryImages ?? []).map((img) =>
      typeof img === "string" ? { url: img } : img,
    ),
    impactPoints: campaign.impactPoints ?? [],
    investors,
    reviews: reviewsRows.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      userName: r.userName?.trim() || r.userEmail.split("@")[0] || "Investor",
    })),
  };
}
