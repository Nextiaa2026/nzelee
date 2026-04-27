import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { withdrawalRequests } from "@/lib/db/schema";
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
  return row;
}
