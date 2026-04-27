import { z } from "zod";

export const adminCreateRewardTierBodySchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(10000).optional().nullable(),
  amount: z.number().int().positive(),
  backerLimit: z.number().int().positive().optional().nullable(),
});

export const adminPatchRewardTierBodySchema = z
  .object({
    title: z.string().trim().min(1).max(120).optional(),
    description: z.union([z.string().trim().max(10000), z.null()]).optional(),
    amount: z.number().int().positive().optional(),
    backerLimit: z.union([z.number().int().positive(), z.null()]).optional(),
  })
  .refine((o) => Object.keys(o).length > 0, { message: "No fields to update" });

export type AdminCreateRewardTierBody = z.infer<typeof adminCreateRewardTierBodySchema>;
export type AdminPatchRewardTierBody = z.infer<typeof adminPatchRewardTierBodySchema>;
