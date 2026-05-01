import { z } from "zod";

import { ageFromDateOfBirth } from "@/lib/utils";
import { investmentCurrencyCodes } from "@/lib/validations/user-investment";

const dateOfBirthSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Pick your date of birth")
  .transform((s) => {
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y!, m! - 1, d);
  })
  .refine((date) => !Number.isNaN(date.getTime()), "Invalid date")
  .superRefine((date, ctx) => {
    const age = ageFromDateOfBirth(date);
    if (age < 18) {
      ctx.addIssue({ code: "custom", message: "You must be at least 18 years old" });
    } else if (age > 120) {
      ctx.addIssue({ code: "custom", message: "Please enter a valid date of birth" });
    }
  });

export const completeOnboardingSchema = z.object({
  displayName: z.string().trim().min(2, "Name is too short").max(120, "Name is too long"),
  country: z
    .string()
    .length(2, "Pick a country")
    .regex(/^[a-zA-Z]{2}$/, "Invalid country")
    .transform((c) => c.toUpperCase()),
  dateOfBirth: dateOfBirthSchema,
  currency: z.enum(investmentCurrencyCodes, {
    message: "Pick a currency",
  }),
});

export type CompleteOnboardingInput = z.infer<typeof completeOnboardingSchema>;
