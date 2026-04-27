import { z } from "zod";

const withdrawalStatuses = [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "COMPLETED",
  "CANCELLED",
] as const;

export const adminCreateWithdrawalRequestBodySchema = z.object({
  userId: z.string().uuid(),
  amount: z.number().int().positive(),
  currency: z.string().trim().min(1).max(12).default("USD"),
  destination: z.string().trim().min(1).max(2000),
  status: z.enum(withdrawalStatuses).optional(),
  adminNote: z.string().trim().max(2000).optional().nullable(),
});

export const adminPatchWithdrawalRequestBodySchema = z
  .object({
    status: z.enum(withdrawalStatuses).optional(),
    adminNote: z.union([z.string().trim().max(2000), z.null()]).optional(),
    destination: z.string().trim().min(1).max(2000).optional(),
    processedAt: z.string().datetime({ offset: true }).optional().nullable(),
    completedAt: z.string().datetime({ offset: true }).optional().nullable(),
  })
  .refine((o) => Object.keys(o).length > 0, { message: "No fields to update" });

export type AdminCreateWithdrawalRequestBody = z.infer<
  typeof adminCreateWithdrawalRequestBodySchema
>;
export type AdminPatchWithdrawalRequestBody = z.infer<
  typeof adminPatchWithdrawalRequestBodySchema
>;
