import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { users, withdrawalRequests } from "@/lib/db/schema";
import type { UserCreateWithdrawalBody } from "@/lib/validations/user-withdrawal";

const wr = withdrawalRequests;

export async function listWithdrawalsForUser(userId: string) {
  return db
    .select()
    .from(wr)
    .where(eq(wr.userId, userId))
    .orderBy(desc(wr.requestedAt));
}

export async function createWithdrawalForUser(userId: string, input: UserCreateWithdrawalBody) {
  const destination = input.note
    ? `${input.destination}\n\nNote: ${input.note}`
    : input.destination;
  const [row] = await db
    .insert(wr)
    .values({
      userId,
      amount: input.amount,
      currency: input.currency,
      status: "PENDING",
      destination,
    })
    .returning();
  if (!row) {
    throw new Error("Failed to create withdrawal request");
  }

  const [u] = await db
    .select({ email: users.email })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (u?.email) {
    try {
      const { onUserWithdrawalSubmitted } = await import("@/lib/services/flow-notifications");
      await onUserWithdrawalSubmitted({
        userId,
        userEmail: u.email,
        withdrawalId: row.id,
        amountCents: row.amount,
        currency: row.currency,
      });
    } catch (e) {
      console.error("[withdrawals] notification side-effect failed", e);
    }
  }

  return row;
}
