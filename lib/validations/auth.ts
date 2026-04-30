import { z } from "zod";

const email = z.email("Veuillez entrer une adresse email valide").trim().toLowerCase();
const password = z
  .string()
  .min(8, "Le mot de passe doit contenir au moins 8 caractères")
  .max(72, "Le mot de passe est trop long");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Le mot de passe est requis"),
});

/** Request body for `POST /auth/register` (no UI-only fields). */
export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères"),
    email,
    password,
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Les mots de passe ne correspondent pas",
  });

/** Sign-up form: same fields plus required terms acceptance. */
export const registerFormSchema = registerSchema.and(
  z.object({
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "Veuillez accepter les conditions pour continuer.",
    }),
  }),
);

export const forgotPasswordSchema = z.object({
  email,
});

export const resendVerificationSchema = z.object({
  email,
});

export const verifyEmailOtpSchema = z.object({
  email,
  code: z
    .string()
    .length(6, "Entrez le code à 6 chiffres")
    .regex(/^\d{6}$/, "Le code doit contenir 6 chiffres"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Le jeton de réinitialisation est manquant"),
    password,
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Les mots de passe ne correspondent pas",
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RegisterFormInput = z.infer<typeof registerFormSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
export type VerifyEmailOtpInput = z.infer<typeof verifyEmailOtpSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
