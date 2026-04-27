import { z } from "zod";

export const completeOnboardingSchema = z.object({
  displayName: z.string().trim().min(2, "Name is too short").max(120, "Name is too long"),
  country: z
    .string()
    .length(2, "Pick a country")
    .regex(/^[a-zA-Z]{2}$/, "Invalid country")
    .transform((c) => c.toUpperCase()),
  organization: z
    .string()
    .max(120, "Organization name is too long")
    .optional()
    .transform((s) => {
      if (s === undefined || s === null) return undefined;
      const t = s.trim();
      return t.length > 0 ? t : undefined;
    }),
});

export type CompleteOnboardingInput = z.infer<typeof completeOnboardingSchema>;
