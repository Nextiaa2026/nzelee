import { Elysia } from "elysia";

import { apiFail, apiOk } from "../../lib/http/api-result";
import {
  forgotPasswordSchema,
  registerSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  verifyEmailOtpSchema,
} from "../../lib/validations/auth";
import { AuthApiErrorCode } from "../../types/api/auth";
import {
  isPasswordResetTokenValid,
  registerUser,
  requestPasswordReset,
  resendVerificationEmail,
  resetPasswordWithToken,
  verifyEmailWithOtp,
} from "../services/auth.service";

const appBaseUrl = () =>
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const authController = new Elysia({ prefix: "/auth" })
  .post("/register", async ({ body, set }) => {
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      set.status = 400;
      return apiFail(
        AuthApiErrorCode.VALIDATION,
        parsed.error.issues[0]?.message ?? "Invalid request body",
      );
    }

    const result = await registerUser(parsed.data);

    if (!result.ok) {
      set.status = 409;
      return result;
    }

    return result;
  })
  .post("/forgot-password", async ({ body, set }) => {
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      set.status = 400;
      return apiFail(
        AuthApiErrorCode.VALIDATION,
        parsed.error.issues[0]?.message ?? "Invalid request body",
      );
    }

    return requestPasswordReset(parsed.data.email, appBaseUrl());
  })
  .post("/resend-verification", async ({ body, set }) => {
    const parsed = resendVerificationSchema.safeParse(body);

    if (!parsed.success) {
      set.status = 400;
      return apiFail(
        AuthApiErrorCode.VALIDATION,
        parsed.error.issues[0]?.message ?? "Invalid request body",
      );
    }

    return resendVerificationEmail(parsed.data.email);
  })
  .post("/verify-email-otp", async ({ body, set }) => {
    const parsed = verifyEmailOtpSchema.safeParse(body);

    if (!parsed.success) {
      set.status = 400;
      return apiFail(
        AuthApiErrorCode.VALIDATION,
        parsed.error.issues[0]?.message ?? "Invalid request body",
      );
    }

    const result = await verifyEmailWithOtp(parsed.data.email, parsed.data.code);
    if (!result.ok) {
      set.status = 400;
    }
    return result;
  })
  .get("/forgot-password", async ({ query, set }) => {
    const token = query.token;

    if (!token || typeof token !== "string") {
      set.status = 400;
      return apiFail(AuthApiErrorCode.VALIDATION, "token query parameter is required.");
    }

    const valid = await isPasswordResetTokenValid(token);
    return apiOk({ valid });
  })
  .post("/reset-password", async ({ body, set }) => {
    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      set.status = 400;
      return apiFail(
        AuthApiErrorCode.VALIDATION,
        parsed.error.issues[0]?.message ?? "Invalid request body",
      );
    }

    const result = await resetPasswordWithToken(
      parsed.data.token,
      parsed.data.password,
    );

    if (!result.ok) {
      set.status = 400;
    }
    return result;
  });
