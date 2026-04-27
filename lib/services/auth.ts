import { httpClient } from "@/lib/http/client";
import { isApiSuccess, type ApiResult } from "@/lib/http/api-result";
import type {
  ForgotPasswordApiResult,
  PasswordResetTokenValidityResult,
  RegisterApiResult,
  ResendVerificationSuccessData,
  ResetPasswordApiResult,
} from "@/types/api/auth";
import type {
  ForgotPasswordInput,
  RegisterInput,
  ResendVerificationInput,
  ResetPasswordInput,
  VerifyEmailOtpInput,
} from "@/lib/validations/auth";

export async function registerAccount(body: RegisterInput): Promise<RegisterApiResult> {
  const { data, status } = await httpClient.post<RegisterApiResult>(
    "/auth/register",
    body,
    { validateStatus: (s) => s === 200 || s === 400 || s === 409 },
  );
  if (status === 200 || status === 400 || status === 409) {
    return data;
  }
  throw new Error(`Unexpected status ${status}`);
}

export async function requestPasswordReset(
  body: ForgotPasswordInput,
): Promise<ForgotPasswordApiResult> {
  const { data, status } = await httpClient.post<ForgotPasswordApiResult>(
    "/auth/forgot-password",
    body,
    { validateStatus: (s) => s === 200 || s === 400 },
  );
  if (status === 200 || status === 400) {
    return data;
  }
  throw new Error(`Unexpected status ${status}`);
}

export async function resendVerificationEmail(
  body: ResendVerificationInput,
): Promise<ApiResult<ResendVerificationSuccessData>> {
  const { data, status } = await httpClient.post<ApiResult<ResendVerificationSuccessData>>(
    "/auth/resend-verification",
    body,
    { validateStatus: (s) => s === 200 || s === 400 },
  );
  if (status === 200 || status === 400) {
    return data;
  }
  throw new Error(`Unexpected status ${status}`);
}

export async function verifyEmailWithOtp(
  body: VerifyEmailOtpInput,
): Promise<ApiResult<{ verified: true }>> {
  const { data, status } = await httpClient.post<ApiResult<{ verified: true }>>(
    "/auth/verify-email-otp",
    body,
    { validateStatus: (s) => s === 200 || s === 400 },
  );
  if (status === 200 || status === 400) {
    return data;
  }
  throw new Error(`Unexpected status ${status}`);
}

export async function resetPassword(
  body: ResetPasswordInput,
): Promise<ResetPasswordApiResult> {
  const { data, status } = await httpClient.post<ResetPasswordApiResult>(
    "/auth/reset-password",
    body,
    { validateStatus: (s) => s === 200 || s === 400 },
  );
  if (status === 200 || status === 400) {
    return data;
  }
  throw new Error(`Unexpected status ${status}`);
}

export async function fetchPasswordResetTokenValidity(
  token: string,
): Promise<PasswordResetTokenValidityResult> {
  const { data, status } = await httpClient.get<PasswordResetTokenValidityResult>(
    "/auth/forgot-password",
    {
      params: { token },
      validateStatus: (s) => s === 200 || s === 400,
    },
  );
  if (status === 200 || status === 400) {
    return data;
  }
  throw new Error(`Unexpected status ${status}`);
}

/** Narrowing helper after `registerAccount` / similar. */
export { isApiSuccess };

export function unwrapApiMessage<T extends { message?: string }>(
  result: ApiResult<T>,
  fallback: string,
): string {
  if (isApiSuccess(result) && typeof result.data.message === "string") {
    return result.data.message;
  }
  if (!result.ok) {
    return result.error.message;
  }
  return fallback;
}
