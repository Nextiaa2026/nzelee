import type { ApiFailure, ApiResult, ApiSuccess } from "@/lib/http/api-result";

/** Shared error codes for `/auth/*` routes (stable contract for clients). */
export const AuthApiErrorCode = {
  VALIDATION: "VALIDATION",
  EMAIL_TAKEN: "EMAIL_TAKEN",
  INVALID_TOKEN: "INVALID_TOKEN",
  VERIFY_EMAIL_FAILED: "VERIFY_EMAIL_FAILED",
} as const;

export type AuthApiErrorCode =
  (typeof AuthApiErrorCode)[keyof typeof AuthApiErrorCode];

export type RegisterSuccessData = {
  message: string;
  /** Set in non-production when email delivery is not wired (omit in production). */
  devVerificationCode?: string;
};

export type RegisterApiResult = ApiResult<RegisterSuccessData>;

export type ResendVerificationSuccessData = {
  message: string;
  devVerificationCode?: string;
};

export type ForgotPasswordSuccessData = { message: string };
export type ForgotPasswordApiResult = ApiResult<ForgotPasswordSuccessData>;

export type ResetPasswordSuccessData = { message: string };
export type ResetPasswordApiResult = ApiResult<ResetPasswordSuccessData>;

export type PasswordResetTokenValidityData = { valid: boolean };
export type PasswordResetTokenValidityResult =
  ApiResult<PasswordResetTokenValidityData>;

export type AuthApiFailure = ApiFailure;
export type AuthApiSuccess<T> = ApiSuccess<T>;
