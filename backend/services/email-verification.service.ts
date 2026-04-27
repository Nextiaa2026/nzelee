import { and, eq, gt } from "drizzle-orm";

import { db } from "../../lib/db";
import { users, verificationTokens } from "../../lib/db/schema";
import { generateEmailOtp, hashToken } from "../../lib/security/tokens";
import * as usersService from "./users.service";

const VERIFY_OTP_MINUTES = 15;

export async function createEmailVerificationChallenge(userId: string) {
  const otp = generateEmailOtp();
  const tokenHash = hashToken(otp);
  const expires = new Date(Date.now() + VERIFY_OTP_MINUTES * 60 * 1000);

  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.identifier, userId));

  await db.insert(verificationTokens).values({
    identifier: userId,
    token: tokenHash,
    expires,
  });

  return { otp, expires };
}

export async function consumeEmailVerificationOtp(
  email: string,
  rawCode: string,
): Promise<{ ok: true } | { ok: false; code: "INVALID_OR_EXPIRED" }> {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await usersService.findUserByEmail(normalizedEmail);

  if (!user || user.emailVerified) {
    return { ok: false, code: "INVALID_OR_EXPIRED" };
  }

  const tokenHash = hashToken(rawCode.trim());
  const [row] = await db
    .select()
    .from(verificationTokens)
    .where(
      and(
        eq(verificationTokens.identifier, user.id),
        eq(verificationTokens.token, tokenHash),
        gt(verificationTokens.expires, new Date()),
      ),
    )
    .limit(1);

  if (!row) {
    return { ok: false, code: "INVALID_OR_EXPIRED" };
  }

  await db
    .delete(verificationTokens)
    .where(
      and(
        eq(verificationTokens.identifier, row.identifier),
        eq(verificationTokens.token, row.token),
      ),
    );

  await db
    .update(users)
    .set({ emailVerified: new Date(), updatedAt: new Date() })
    .where(eq(users.id, row.identifier));

  return { ok: true };
}
