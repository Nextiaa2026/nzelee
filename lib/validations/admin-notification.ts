import { z } from "zod";

export const adminSendNotificationBodySchema = z
  .object({
    scope: z.enum(["USER", "BROADCAST"]).default("USER"),
    userId: z.string().uuid("Invalid user id").optional(),
    type: z
      .enum(["SYSTEM", "KYC", "INVESTMENT", "WITHDRAWAL", "GENERAL"])
      .default("GENERAL"),
    title: z.string().trim().min(3, "Title is too short").max(180),
    body: z.string().trim().max(1500).optional(),
    href: z.string().trim().max(512).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.scope === "USER" && !data.userId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["userId"],
        message: "userId is required when scope is USER",
      });
    }
  });

export const adminNotificationTargetQuerySchema = z.object({
  q: z.string().trim().max(120).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(25),
});

export type AdminSendNotificationBody = z.infer<typeof adminSendNotificationBodySchema>;
export type AdminNotificationTargetQuery = z.infer<typeof adminNotificationTargetQuerySchema>;
