import { z } from "zod";

const email = z.email("Please enter a valid email address").trim().toLowerCase();
const password = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password is too long");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email,
    password,
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

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
    .length(6, "Enter the 6-digit code")
    .regex(/^\d{6}$/, "Code must be 6 digits"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is missing"),
    password,
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
export type VerifyEmailOtpInput = z.infer<typeof verifyEmailOtpSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
