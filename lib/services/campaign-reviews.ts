import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { campaignReviews, campaigns } from "@/lib/db/schema";
import { apiFail, apiOk, type ApiResult } from "@/lib/http/api-result";

export type CreateCampaignReviewResult = { status: number; result: ApiResult<{ id: string | null }> };

export async function createCampaignReviewForSlug(
  userId: string,
  slug: string,
  input: { rating: number; comment: string },
): Promise<CreateCampaignReviewResult> {
  const [campaign] = await db
    .select({ id: campaigns.id })
    .from(campaigns)
    .where(eq(campaigns.slug, slug))
    .limit(1);
  if (!campaign) {
    return { status: 404, result: apiFail("NOT_FOUND", "Campaign not found.") };
  }

  const [row] = await db
    .insert(campaignReviews)
    .values({
      campaignId: campaign.id,
      userId,
      rating: input.rating,
      comment: input.comment,
    })
    .returning({ id: campaignReviews.id });

  return { status: 201, result: apiOk({ id: row?.id ?? null }) };
}
