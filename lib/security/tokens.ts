import { createHash, randomBytes, randomInt } from "crypto";

export function generateToken(bytes = 32) {
  return randomBytes(bytes).toString("hex");
}

/** Six-digit numeric code for email verification (100000–999999). */
export function generateEmailOtp() {
  return String(randomInt(100_000, 1_000_000));
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
