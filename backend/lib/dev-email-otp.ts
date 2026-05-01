/** Include plaintext OTP in JSON for local dev when email is not integrated yet. */
export function exposeEmailVerificationOtpInResponse(): boolean {
  if (process.env.EXPOSE_EMAIL_VERIFICATION_OTP === "0") return false;
  return true;
}
