import { exposeEmailVerificationOtpInResponse } from "../lib/dev-email-otp";
import { apiFail, apiOk, type ApiResult } from "../../lib/http/api-result";
import type { RegisterInput } from "../../lib/validations/auth";
import {
  AuthApiErrorCode,
  type ForgotPasswordApiResult,
  type RegisterApiResult,
  type ResendVerificationSuccessData,
  type ResetPasswordApiResult,
} from "../../types/api/auth";
import * as emailVerificationService from "./email-verification.service";
import * as passwordResetTokensService from "./password-reset-tokens.service";
import * as usersService from "./users.service";

const FORGOT_PASSWORD_MESSAGE =
  "If that email exists, a reset link has been generated.";

const RESEND_VERIFICATION_MESSAGE =
  "If an account exists and still needs verification, we sent a new verification code.";

export async function registerUser(input: RegisterInput): Promise<RegisterApiResult> {
  if (await usersService.emailExists(input.email)) {
    return apiFail(
      AuthApiErrorCode.EMAIL_TAKEN,
      "An account with this email already exists.",
    );
  }

  const userId = await usersService.createUserWithPassword({
    name: input.name,
    email: input.email,
    password: input.password,
  });

  const { otp } = await emailVerificationService.createEmailVerificationChallenge(userId);
  console.log(`[Auth] Email verification OTP for ${input.email}: ${otp}`);

  return apiOk({
    message:
      "Account created. Enter the 6-digit code we emailed you to verify your address before signing in.",
    ...(exposeEmailVerificationOtpInResponse() ? { devVerificationCode: otp } : {}),
  });
}

export async function requestPasswordReset(
  email: string,
  appBaseUrl: string,
): Promise<ForgotPasswordApiResult> {
  const user = await usersService.findUserByEmail(email);

  if (user) {
    const { rawToken } = await passwordResetTokensService.createTokenForUser(user.id);
    const resetLink = `${appBaseUrl}/reset-password?token=${rawToken}`;
    console.log(`[Auth] Password reset link for ${email}: ${resetLink}`);
  }

  return apiOk({ message: FORGOT_PASSWORD_MESSAGE });
}

export async function isPasswordResetTokenValid(rawToken: string) {
  const record = await passwordResetTokensService.findActiveByRawToken(rawToken);
  return Boolean(record);
}

export async function resetPasswordWithToken(
  rawToken: string,
  newPassword: string,
): Promise<ResetPasswordApiResult> {
  const record = await passwordResetTokensService.findActiveByRawToken(rawToken);

  if (!record) {
    return apiFail(
      AuthApiErrorCode.INVALID_TOKEN,
      "Reset token is invalid or has expired.",
    );
  }

  await usersService.updateUserPassword(record.userId, newPassword);
  await passwordResetTokensService.markTokenUsed(record.id);
  await usersService.markEmailVerified(record.userId);

  return apiOk({ message: "Password updated. You can sign in with your new password." });
}

export async function verifyEmailWithOtp(
  email: string,
  code: string,
): Promise<ApiResult<{ verified: true }>> {
  const result = await emailVerificationService.consumeEmailVerificationOtp(email, code);
  if (!result.ok) {
    return apiFail(
      AuthApiErrorCode.VERIFY_EMAIL_FAILED,
      "Invalid or expired verification code. Request a new code from the sign-in page.",
    );
  }
  return apiOk({ verified: true });
}

export async function resendVerificationEmail(
  email: string,
): Promise<ApiResult<ResendVerificationSuccessData>> {
  const normalized = email.trim().toLowerCase();
  const user = await usersService.findUserByEmail(normalized);

  const base: ResendVerificationSuccessData = { message: RESEND_VERIFICATION_MESSAGE };

  if (user?.passwordHash && !user.emailVerified) {
    const { otp } = await emailVerificationService.createEmailVerificationChallenge(user.id);
    console.log(`[Auth] Resend email verification OTP for ${normalized}: ${otp}`);
    return apiOk({
      ...base,
      ...(exposeEmailVerificationOtpInResponse() ? { devVerificationCode: otp } : {}),
    });
  }

  return apiOk(base);
}
