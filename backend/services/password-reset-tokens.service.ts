import { and, eq, gt } from "drizzle-orm";

import { db } from "../../lib/db";
import { passwordResetTokens } from "../../lib/db/schema";
import { generateToken, hashToken } from "../../lib/security/tokens";

const RESET_WINDOW_MINUTES = 30;

export async function createTokenForUser(userId: string) {
  const rawToken = generateToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + RESET_WINDOW_MINUTES * 60 * 1000);

  await db.insert(passwordResetTokens).values({
    userId,
    tokenHash,
    expiresAt,
  });

  return { rawToken, expiresAt };
}

export async function findActiveByRawToken(rawToken: string) {
  const tokenHash = hashToken(rawToken);
  const [record] = await db
    .select()
    .from(passwordResetTokens)
    .where(
      and(
        eq(passwordResetTokens.tokenHash, tokenHash),
        eq(passwordResetTokens.used, false),
        gt(passwordResetTokens.expiresAt, new Date())
      )
    )
    .limit(1);
  return record ?? null;
}

export async function markTokenUsed(tokenRecordId: string) {
  await db
    .update(passwordResetTokens)
    .set({ used: true })
    .where(eq(passwordResetTokens.id, tokenRecordId));
}
