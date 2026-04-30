import { z } from "zod";

export const createCampaignReviewBodySchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(5).max(1500),
});

export type CreateCampaignReviewBody = z.infer<typeof createCampaignReviewBodySchema>;
