import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80),
  email: z.string().trim().email("Enter a valid email"),
  message: z.string().trim().min(10, "Message is too short").max(4000),
});

export const newsletterFormSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
});

export const withdrawalRequestSchema = z.object({
  amount: z.number().positive("Enter a positive amount"),
  destination: z.enum(["bank", "wallet"]),
  note: z.string().trim().max(500).optional(),
});

export const investmentCommitmentSchema = z.object({
  listingSlug: z
    .string()
    .trim()
    .min(1, "Listing slug or ID is required")
    .max(220),
  amount: z.number().positive("Amount must be greater than zero"),
  note: z.string().trim().max(500).optional(),
});

export const profileSettingsSchema = z.object({
  displayName: z.string().trim().min(2, "Name is too short").max(120),
  organization: z.string().trim().max(120).optional(),
});
