import { and, desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { campaignFavorites, campaigns } from "@/lib/db/schema";

export type FavoriteCampaignSummary = {
  campaignId: string;
  savedAt: Date;
  title: string;
  slug: string;
  status: (typeof campaigns.$inferSelect)["status"];
  summary: string;
  coverImageUrl: string | null;
  goalAmount: number;
  raisedAmount: number;
  currency: string;
};

export async function listFavoriteCampaignSummaries(
  userId: string,
): Promise<FavoriteCampaignSummary[]> {
  const rows = await db
    .select({
      campaignId: campaigns.id,
      savedAt: campaignFavorites.createdAt,
      title: campaigns.title,
      slug: campaigns.slug,
      status: campaigns.status,
      summary: campaigns.summary,
      coverImageUrl: campaigns.coverImageUrl,
      goalAmount: campaigns.goalAmount,
      raisedAmount: campaigns.raisedAmount,
      currency: campaigns.currency,
    })
    .from(campaignFavorites)
    .innerJoin(campaigns, eq(campaignFavorites.campaignId, campaigns.id))
    .where(eq(campaignFavorites.userId, userId))
    .orderBy(desc(campaignFavorites.createdAt));

  return rows;
}

export async function addCampaignFavorite(
  userId: string,
  campaignId: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const [c] = await db
    .select({ id: campaigns.id })
    .from(campaigns)
    .where(eq(campaigns.id, campaignId))
    .limit(1);

  if (!c) {
    return { ok: false, message: "Campaign not found." };
  }

  await db
    .insert(campaignFavorites)
    .values({ userId, campaignId })
    .onConflictDoNothing({
      target: [campaignFavorites.userId, campaignFavorites.campaignId],
    });

  return { ok: true };
}

export async function removeCampaignFavorite(userId: string, campaignId: string) {
  await db
    .delete(campaignFavorites)
    .where(
      and(eq(campaignFavorites.userId, userId), eq(campaignFavorites.campaignId, campaignId)),
    );
}
