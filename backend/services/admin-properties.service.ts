import { and, desc, eq, ne } from "drizzle-orm";

import { db } from "@/lib/db";
import { properties } from "@/lib/db/schema";

export type AdminPropertyStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "SOLD" | "CLOSED";
export type AdminPropertyType =
  | "RESIDENTIAL"
  | "COMMERCIAL"
  | "INDUSTRIAL"
  | "LAND"
  | "MIXED_USE"
  | "HOSPITALITY"
  | "OTHER";

export type AdminCreatePropertyBody = {
  slug?: string;
  name: string;
  description?: string | null;
  type?: AdminPropertyType;
  status?: AdminPropertyStatus;
  country: string;
  city?: string | null;
  coverImageUrl?: string | null;
  appraisedValue?: number | null;
  currency?: string;
};

export type AdminPatchPropertyBody = Partial<AdminCreatePropertyBody>;

function slugify(value: string) {
  return value
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
      .select({ id: properties.id })
      .from(properties)
      .where(and(eq(properties.slug, slug), ne(properties.id, excludeId)))
      .limit(1);
    return row !== undefined;
  }
  const [row] = await db
    .select({ id: properties.id })
    .from(properties)
    .where(eq(properties.slug, slug))
    .limit(1);
  return row !== undefined;
}

async function ensureUniqueSlug(baseSlug: string, excludeId?: string) {
  let slug = baseSlug || "property";
  let n = 0;
  while (await isSlugTaken(slug, excludeId)) {
    n += 1;
    const suffix = `-${n}`;
    slug = `${baseSlug.slice(0, Math.max(1, 220 - suffix.length))}${suffix}`;
  }
  return slug;
}

export async function listProperties() {
  return db.select().from(properties).orderBy(desc(properties.createdAt));
}

export async function getPropertyById(id: string) {
  const [row] = await db.select().from(properties).where(eq(properties.id, id)).limit(1);
  return row ?? null;
}

export async function createProperty(adminUserId: string, input: AdminCreatePropertyBody) {
  const baseSlug = slugify(input.slug?.trim() || input.name);
  const slug = await ensureUniqueSlug(baseSlug || "property");

  const [row] = await db
    .insert(properties)
    .values({
      slug,
      name: input.name.trim(),
      description: input.description?.trim() || null,
      type: input.type ?? "OTHER",
      status: input.status ?? "DRAFT",
      country: input.country.trim().toUpperCase(),
      city: input.city?.trim() || null,
      coverImageUrl: input.coverImageUrl?.trim() || null,
      appraisedValue: input.appraisedValue ?? null,
      currency: input.currency?.trim() || "USD",
      createdByUserId: adminUserId,
    })
    .returning();

  if (!row) {
    throw new Error("Failed to create property");
  }
  return row;
}

export async function updateProperty(id: string, input: AdminPatchPropertyBody) {
  const existing = await getPropertyById(id);
  if (!existing) return null;

  const updates: Partial<typeof properties.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (input.name !== undefined) updates.name = input.name.trim();
  if (input.description !== undefined) updates.description = input.description?.trim() || null;
  if (input.type !== undefined) updates.type = input.type;
  if (input.status !== undefined) updates.status = input.status;
  if (input.country !== undefined) updates.country = input.country.trim().toUpperCase();
  if (input.city !== undefined) updates.city = input.city?.trim() || null;
  if (input.coverImageUrl !== undefined) updates.coverImageUrl = input.coverImageUrl?.trim() || null;
  if (input.appraisedValue !== undefined) updates.appraisedValue = input.appraisedValue;
  if (input.currency !== undefined) updates.currency = input.currency.trim();

  if (input.slug !== undefined) {
    const candidate = slugify(input.slug) || existing.slug;
    updates.slug =
      candidate === existing.slug ? existing.slug : await ensureUniqueSlug(candidate, id);
  }

  const [row] = await db.update(properties).set(updates).where(eq(properties.id, id)).returning();
  return row ?? null;
}

export async function deleteProperty(id: string) {
  const [row] = await db.delete(properties).where(eq(properties.id, id)).returning({ id: properties.id });
  return row !== undefined;
}
