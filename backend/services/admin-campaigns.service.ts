import { and, desc, eq, ilike, ne, or, sql } from "drizzle-orm";

import { db } from "../../lib/db";
import { campaigns } from "../../lib/db/schema";
import type {
  AdminCreateCampaignBody,
  AdminUpdateCampaignBody,
} from "../../lib/validations/admin-campaign";

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 200);
}

async function isSlugTaken(slug: string, excludeId?: string) {
  if (excludeId) {
    const [row] = await db
      .select({ id: campaigns.id })
      .from(campaigns)
      .where(and(eq(campaigns.slug, slug), ne(campaigns.id, excludeId)))
      .limit(1);
    return row !== undefined;
  }
  const [row] = await db
    .select({ id: campaigns.id })
    .from(campaigns)
    .where(eq(campaigns.slug, slug))
    .limit(1);
  return row !== undefined;
}

async function ensureUniqueSlug(baseSlug: string, excludeId?: string) {
  let slug = baseSlug || "listing";
  let n = 0;
  while (await isSlugTaken(slug, excludeId)) {
    n += 1;
    const suffix = `-${n}`;
    slug = `${baseSlug.slice(0, Math.max(1, 220 - suffix.length))}${suffix}`;
  }
  return slug;
}

export async function listCampaigns(params: {
  page: number;
  pageSize: number;
  search?: string;
}) {
  const offset = (params.page - 1) * params.pageSize;
  const searchTerm = params.search?.trim();
  const whereClause =
    searchTerm && searchTerm.length > 0
      ? or(
          ilike(campaigns.title, `%${searchTerm}%`),
          ilike(campaigns.slug, `%${searchTerm}%`),
        )
      : undefined;
  const [countRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(campaigns)
    .where(whereClause);
  const rows = await db
    .select()
    .from(campaigns)
    .where(whereClause)
    .orderBy(desc(campaigns.createdAt))
    .limit(params.pageSize)
    .offset(offset);
  return {
    rows,
    total: countRow?.count ?? 0,
    page: params.page,
    pageSize: params.pageSize,
  };
}

export async function getCampaignById(id: string) {
  const [row] = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.id, id))
    .limit(1);
  return row ?? null;
}

export async function createCampaign(
  adminUserId: string,
  input: AdminCreateCampaignBody,
) {
  const rawSlug = input.slug?.trim();
  const baseSlug = rawSlug ? slugify(rawSlug) : slugify(input.title);
  const slug = await ensureUniqueSlug(baseSlug || "listing");

  const [row] = await db
    .insert(campaigns)
    .values({
      creatorId: adminUserId,
      title: input.title.trim(),
      slug,
      summary: input.summary.trim(),
      description: input.description.trim(),
      activitySector: input.activitySector?.trim() ?? null,
      projectOwner: input.projectOwner?.trim() ?? null,
      tags: input.tags ?? [],
      documents: input.documents ?? [],
      coverImageUrl: input.coverImageUrl ?? null,
      goalAmount: input.goalAmount,
      raisedAmount: 0,
      currency: input.currency?.trim() || "USD",
      isFeatured: input.isFeatured ?? false,
      status: input.status ?? "DRAFT",
      startsAt: input.startsAt ? new Date(input.startsAt) : null,
      endsAt: input.endsAt ? new Date(input.endsAt) : null,
    })
    .returning();

  if (!row) {
    throw new Error("Failed to create campaign");
  }
  return row;
}

export async function updateCampaign(
  id: string,
  input: AdminUpdateCampaignBody,
) {
  const existing = await getCampaignById(id);
  if (!existing) {
    return null;
  }

  const updates: Partial<typeof campaigns.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (input.title !== undefined) updates.title = input.title.trim();
  if (input.summary !== undefined) updates.summary = input.summary.trim();
  if (input.description !== undefined)
    updates.description = input.description.trim();
  if (input.activitySector !== undefined)
    updates.activitySector = input.activitySector.trim();
  if (input.projectOwner !== undefined)
    updates.projectOwner = input.projectOwner.trim();
  if (input.tags !== undefined) updates.tags = input.tags;
  if (input.documents !== undefined) updates.documents = input.documents;
  if (input.goalAmount !== undefined) updates.goalAmount = input.goalAmount;
  if (input.currency !== undefined) updates.currency = input.currency.trim();
  if (input.isFeatured !== undefined) updates.isFeatured = input.isFeatured;
  if (input.status !== undefined) updates.status = input.status;
  if (input.coverImageUrl !== undefined)
    updates.coverImageUrl = input.coverImageUrl;
  if (input.startsAt !== undefined) {
    updates.startsAt = input.startsAt ? new Date(input.startsAt) : null;
  }
  if (input.endsAt !== undefined) {
    updates.endsAt = input.endsAt ? new Date(input.endsAt) : null;
  }

  if (input.slug !== undefined) {
    const candidate = slugify(input.slug) || existing.slug;
    updates.slug =
      candidate === existing.slug
        ? existing.slug
        : await ensureUniqueSlug(candidate, id);
  }

  const [row] = await db
    .update(campaigns)
    .set(updates)
    .where(eq(campaigns.id, id))
    .returning();

  return row ?? null;
}

export async function deleteCampaign(id: string) {
  const existing = await getCampaignById(id);
  if (!existing) {
    return false;
  }
  await db.delete(campaigns).where(eq(campaigns.id, id));
  return true;
}
