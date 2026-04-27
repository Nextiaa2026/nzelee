import { z } from "zod";

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().max(200).optional(),
});

export const statsRangeQuerySchema = z.object({
  range: z.enum(["30d", "90d", "6m", "1y"]).default("90d"),
});
