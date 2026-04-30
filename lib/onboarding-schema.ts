import { z } from "zod";

export const onboardingSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  country: z.string().length(2, "Please select a country"),
  dateOfBirth: z.string().refine((val) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(val)) return false;
    const date = new Date(val);
    if (isNaN(date.getTime())) return false;
    const age = new Date().getFullYear() - date.getFullYear();
    return age >= 18 && age <= 120;
  }, "You must be 18 or older"),
  organization: z.string().optional(),
});

export type OnboardingData = z.infer<typeof onboardingSchema>;

export const kycSchema = z.object({
  idType: z.enum(["PASSPORT", "ID_CARD", "DRIVERS_LICENSE"]),
  idNumber: z.string().min(4, "ID number must be at least 4 characters"),
  frontIdUrl: z.string().min(1, "Front of ID is required"),
  backIdUrl: z.string().optional(),
  selfieUrl: z.string().min(1, "Selfie is required for verification"),
});

export type KycData = z.infer<typeof kycSchema>;
