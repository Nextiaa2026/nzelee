import { z } from "zod";

const userRoles = ["USER", "CREATOR", "ADMIN"] as const;

export const adminPatchUserBodySchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    role: z.enum(userRoles).optional(),
  })
  .refine((o) => Object.keys(o).length > 0, { message: "No fields to update" });

export type AdminPatchUserBody = z.infer<typeof adminPatchUserBodySchema>;
