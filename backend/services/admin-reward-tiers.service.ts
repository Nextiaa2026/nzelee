import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { rewardTiers } from "@/lib/db/schema";
import type {
  AdminCreateRewardTierBody,
  AdminPatchRewardTierBody,
} from "@/lib/validations/admin-reward-tier";

export async function listRewardTiersByCampaign(campaignId: string) {
  return db
    .select()
    .from(rewardTiers)
    .where(eq(rewardTiers.campaignId, campaignId))
    .orderBy(desc(rewardTiers.createdAt));
}

export async function getRewardTierById(id: string) {
  const [row] = await db
    .select()
    .from(rewardTiers)
    .where(eq(rewardTiers.id, id))
    .limit(1);
  return row ?? null;
}

export async function createRewardTier(
  campaignId: string,
  input: AdminCreateRewardTierBody,
) {
  const [row] = await db
    .insert(rewardTiers)
    .values({
      campaignId,
      title: input.title,
      description: input.description ?? null,
      amount: input.amount,
      backerLimit: input.backerLimit ?? null,
    })
    .returning();
  if (!row) {
    throw new Error("Failed to create reward tier");
  }
  return row;
}

export async function updateRewardTier(id: string, input: AdminPatchRewardTierBody) {
  const updates: Record<string, unknown> = {};
  if (input.title !== undefined) updates.title = input.title;
  if (input.description !== undefined) updates.description = input.description;
  if (input.amount !== undefined) updates.amount = input.amount;
  if (input.backerLimit !== undefined) updates.backerLimit = input.backerLimit;
  const [row] = await db
    .update(rewardTiers)
    .set(updates)
    .where(eq(rewardTiers.id, id))
    .returning();
  return row ?? null;
}

export async function deleteRewardTier(id: string): Promise<boolean> {
  const [row] = await db
    .delete(rewardTiers)
    .where(eq(rewardTiers.id, id))
    .returning({ id: rewardTiers.id });
  return row !== undefined;
}
