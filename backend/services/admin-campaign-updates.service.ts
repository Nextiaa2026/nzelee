import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { campaignUpdates } from "@/lib/db/schema";
import type {
  AdminCreateCampaignUpdateBody,
  AdminPatchCampaignUpdateBody,
} from "@/lib/validations/admin-campaign-update-entity";

const cu = campaignUpdates;

export async function listCampaignUpdatesByCampaign(campaignId: string) {
  return db
    .select()
    .from(cu)
    .where(eq(cu.campaignId, campaignId))
    .orderBy(desc(cu.publishedAt));
}

export async function getCampaignUpdateById(id: string) {
  const [row] = await db.select().from(cu).where(eq(cu.id, id)).limit(1);
  return row ?? null;
}

export async function createCampaignUpdate(
  campaignId: string,
  input: AdminCreateCampaignUpdateBody,
) {
  const [row] = await db
    .insert(cu)
    .values({
      campaignId,
      title: input.title,
      content: input.content,
      publishedAt: input.publishedAt
        ? new Date(input.publishedAt)
        : new Date(),
    })
    .returning();
  if (!row) {
    throw new Error("Failed to create update");
  }
  return row;
}

export async function updateCampaignUpdate(id: string, input: AdminPatchCampaignUpdateBody) {
  const updates: Record<string, unknown> = {};
  if (input.title !== undefined) updates.title = input.title;
  if (input.content !== undefined) updates.content = input.content;
  if (input.publishedAt !== undefined) {
    updates.publishedAt = input.publishedAt ? new Date(input.publishedAt) : null;
  }
  const [row] = await db.update(cu).set(updates).where(eq(cu.id, id)).returning();
  return row ?? null;
}

export async function deleteCampaignUpdate(id: string): Promise<boolean> {
  const [row] = await db.delete(cu).where(eq(cu.id, id)).returning({ id: cu.id });
  return row !== undefined;
}
