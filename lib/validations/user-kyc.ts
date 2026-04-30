import { z } from "zod";

export const userKycSubmitBodySchema = z
  .object({
    idType: z.enum(["PASSPORT", "ID_CARD", "DRIVERS_LICENSE"]),
    idNumber: z.string().min(4, "ID number must be at least 4 characters"),
    frontIdUrl: z.string().min(8, "Front document is required"),
    backIdUrl: z.string().optional().nullable(),
    selfieUrl: z.string().min(8, "Selfie is required"),
  })
  .superRefine((data, ctx) => {
    if (data.idType !== "PASSPORT") {
      const back = data.backIdUrl?.trim();
      if (!back) {
        ctx.addIssue({
          code: "custom",
          message: "Back of ID is required for this document type.",
          path: ["backIdUrl"],
        });
      }
    }
  });

export type UserKycSubmitBody = z.infer<typeof userKycSubmitBodySchema>;
