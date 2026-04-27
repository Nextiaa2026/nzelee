import { z } from "zod";

export const campaignStatusValues = [
  "DRAFT",
  "LIVE",
  "FUNDED",
  "CLOSED",
  "CANCELLED",
] as const;

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
  /** Goal in smallest currency unit (e.g. cents). */
  goalAmount: z.number().int().positive(),
  currency: z.string().trim().max(12).optional(),
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
    goalAmount: z.number().int().positive().optional(),
    currency: z.string().trim().max(12).optional(),
    status: z.enum(campaignStatusValues).optional(),
    coverImageUrl: z
      .union([z.string().trim().url(), z.literal(""), z.null()])
      .optional()
      .transform((s) => (s === undefined ? undefined : s === null || s === "" ? null : s)),
    startsAt: z.string().datetime({ offset: true }).optional().nullable(),
    endsAt: z.string().datetime({ offset: true }).optional().nullable(),
  })
  .refine((o) => Object.keys(o).length > 0, { message: "No fields to update" });

export type AdminCreateCampaignBody = z.infer<typeof adminCreateCampaignBodySchema>;
export type AdminUpdateCampaignBody = z.infer<typeof adminUpdateCampaignBodySchema>;
