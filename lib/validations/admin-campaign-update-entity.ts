import { z } from "zod";

export const adminCreateCampaignUpdateBodySchema = z.object({
  title: z.string().trim().min(1).max(180),
  content: z.string().trim().min(1),
  publishedAt: z.string().datetime({ offset: true }).optional(),
});

export const adminPatchCampaignUpdateBodySchema = z
  .object({
    title: z.string().trim().min(1).max(180).optional(),
    content: z.string().trim().min(1).optional(),
    publishedAt: z.string().datetime({ offset: true }).optional().nullable(),
  })
  .refine((o) => Object.keys(o).length > 0, { message: "No fields to update" });

export type AdminCreateCampaignUpdateBody = z.infer<
  typeof adminCreateCampaignUpdateBodySchema
>;
export type AdminPatchCampaignUpdateBody = z.infer<
  typeof adminPatchCampaignUpdateBodySchema
>;
