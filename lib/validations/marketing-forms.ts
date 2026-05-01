import { z } from "zod";
import { investmentCurrencyCodes } from "@/lib/validations/user-investment";

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
  currency: z.enum(investmentCurrencyCodes).default("XAF"),
  paymentMethod: z.enum(["MOBILE_MONEY", "ORANGE_MONEY"]).default("MOBILE_MONEY"),
  note: z.string().trim().max(500).optional(),
});

export const profileSettingsSchema = z.object({
  displayName: z.string().trim().min(2, "Name is too short").max(120),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  organization: z.string().trim().max(120).optional(),
  country: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{2}$/, "Country must be a 2-letter code")
    .optional()
    .or(z.literal("")),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be YYYY-MM-DD")
    .optional()
    .or(z.literal("")),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
});
