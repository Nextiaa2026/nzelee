import { z } from "zod";

/** Amount in smallest currency unit (cents). */
export const userCreateWithdrawalBodySchema = z.object({
  amount: z.number().int().positive(),
  currency: z.string().trim().min(1).max(12).default("USD"),
  destination: z.string().trim().min(1).max(2000),
  note: z.string().trim().max(2000).optional(),
});

export type UserCreateWithdrawalBody = z.infer<typeof userCreateWithdrawalBodySchema>;
