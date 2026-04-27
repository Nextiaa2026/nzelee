import { z } from "zod";

const pledgeStatuses = ["PENDING", "PAID", "FAILED", "REFUNDED"] as const;

export const adminPatchPledgeBodySchema = z.object({
  status: z.enum(pledgeStatuses),
});

export type AdminPatchPledgeBody = z.infer<typeof adminPatchPledgeBodySchema>;
