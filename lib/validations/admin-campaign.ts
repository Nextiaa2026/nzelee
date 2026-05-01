import { z } from "zod";

export const campaignStatusValues = [
  "DRAFT",
  "LIVE",
  "FUNDED",
  "CLOSED",
  "CANCELLED",
] as const;

const documentItemSchema = z.object({
  name: z.string().trim().min(1).max(120),
  url: z.string().trim().url(),
});

const galleryImageItemSchema = z.object({
  url: z.string().trim().url(),
  alt: z.string().trim().max(160).optional(),
});

export const adminCreateCampaignBodySchema = z.object({
  title: z.string().trim().min(1).max(180),
  slug: z
    .string()
    .trim()
    .max(220)
    .optional()
    .transform((s) => (s && s.length > 0 ? s : undefined)),
  summary: z.string().trim().min(1).max(320),
  description: z.string().trim().min(1),
  activitySector: z.string().trim().max(100).optional(),
  projectOwner: z.string().trim().max(120).optional(),
  locationLabel: z.string().trim().max(160).optional(),
  isVerified: z.boolean().optional(),
  tags: z.array(z.string().trim().min(1)).default([]),
  documents: z.array(documentItemSchema).default([]),
  galleryImages: z.array(galleryImageItemSchema).default([]),
  impactPoints: z.array(z.string().trim().min(1).max(180)).default([]),
  /** Goal in smallest currency unit (e.g. cents). */
  goalAmount: z.number().int().positive(),
  minimumInvestmentAmount: z.number().int().positive().optional(),
  targetReturnRate: z.number().int().min(0).max(100).optional(),
  durationMonths: z.number().int().positive().max(240).optional(),
  currency: z.string().trim().max(12).optional(),
  isFeatured: z.boolean().optional(),
  status: z.enum(campaignStatusValues).optional(),
  coverImageUrl: z
    .union([z.string().trim().url(), z.literal("")])
    .optional()
    .transform((s) => (s === undefined || s === "" ? undefined : s)),
  startsAt: z.string().datetime({ offset: true }).optional().nullable(),
  endsAt: z.string().datetime({ offset: true }).optional().nullable(),
});

export const adminUpdateCampaignBodySchema = z
  .object({
    title: z.string().trim().min(1).max(180).optional(),
    slug: z
      .string()
      .trim()
      .max(220)
      .optional()
      .transform((s) => (s && s.length > 0 ? s : undefined)),
    summary: z.string().trim().min(1).max(320).optional(),
    description: z.string().trim().min(1).optional(),
    activitySector: z.string().trim().max(100).optional(),
    projectOwner: z.string().trim().max(120).optional(),
    locationLabel: z.string().trim().max(160).optional(),
    isVerified: z.boolean().optional(),
    tags: z.array(z.string().trim().min(1)).optional(),
    documents: z.array(documentItemSchema).optional(),
    galleryImages: z.array(galleryImageItemSchema).optional(),
    impactPoints: z.array(z.string().trim().min(1).max(180)).optional(),
    goalAmount: z.number().int().positive().optional(),
    minimumInvestmentAmount: z.number().int().positive().optional(),
    targetReturnRate: z.number().int().min(0).max(100).optional(),
    durationMonths: z.number().int().positive().max(240).optional(),
    currency: z.string().trim().max(12).optional(),
    isFeatured: z.boolean().optional(),
    status: z.enum(campaignStatusValues).optional(),
    coverImageUrl: z
      .union([z.string().trim().url(), z.literal(""), z.null()])
      .optional()
      .transform((s) =>
        s === undefined ? undefined : s === null || s === "" ? null : s,
      ),
    startsAt: z.string().datetime({ offset: true }).optional().nullable(),
    endsAt: z.string().datetime({ offset: true }).optional().nullable(),
  })
  .refine((o) => Object.keys(o).length > 0, { message: "No fields to update" });

export type AdminCreateCampaignBody = z.infer<
  typeof adminCreateCampaignBodySchema
>;
export type AdminUpdateCampaignBody = z.infer<
  typeof adminUpdateCampaignBodySchema
>;
