import { z } from "zod";

export const investmentCurrencyCodes = [
  "USD",
  "XAF",
  "EUR",
  "GBP",
  "NGN",
  "GHS",
  "KES",
  "ZAR",
  "CAD",
  "JPY",
  "CNY",
] as const;

/** Amount in smallest currency unit (cents). */
export const userCreateInvestmentBodySchema = z.object({
  campaignRef: z.string().trim().min(1).max(220),
  amount: z.number().int().positive(),
  sourceCurrency: z.enum(investmentCurrencyCodes).default("XAF"),
  paymentMethod: z.enum(["MOBILE_MONEY", "ORANGE_MONEY"]).default("MOBILE_MONEY"),
  note: z.string().trim().max(500).optional(),
});

export type UserCreateInvestmentBody = z.infer<typeof userCreateInvestmentBodySchema>;
