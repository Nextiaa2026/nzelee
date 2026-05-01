import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { campaigns } from "@/lib/db/schema";

export type UserCampaignProject = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  activitySector: string | null;
  projectOwner: string | null;
  tags: string[];
  documents: Array<{ name: string; url: string }>;
  goalAmount: number;
  currency: string;
  isFeatured: boolean;
  status: (typeof campaigns.$inferSelect)["status"];
  coverImageUrl: string | null;
  startsAt: Date | null;
  endsAt: Date | null;
};

/** @deprecated Use `UserCampaignProject` */
export type UserCampaignSummary = UserCampaignProject;

export async function listMyCampaignProjects(
  userId: string,
): Promise<UserCampaignProject[]> {
  const rows = await db
    .select({
      id: campaigns.id,
      title: campaigns.title,
      slug: campaigns.slug,
      summary: campaigns.summary,
      description: campaigns.description,
      activitySector: campaigns.activitySector,
      projectOwner: campaigns.projectOwner,
      tags: campaigns.tags,
      documents: campaigns.documents,
      goalAmount: campaigns.goalAmount,
      currency: campaigns.currency,
      isFeatured: campaigns.isFeatured,
      status: campaigns.status,
      coverImageUrl: campaigns.coverImageUrl,
      startsAt: campaigns.startsAt,
      endsAt: campaigns.endsAt,
    })
    .from(campaigns)
    .where(eq(campaigns.creatorId, userId))
    .orderBy(desc(campaigns.updatedAt))
    .limit(25);

  return rows.map((row) => ({
    ...row,
    tags: row.tags ?? [],
    documents: (row.documents ?? []).map((doc, idx) =>
      typeof doc === "string" ? { name: `Document ${idx + 1}`, url: doc } : doc,
    ),
  }));
}
