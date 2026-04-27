import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { users, withdrawalRequests } from "@/lib/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import type {
  AdminCreateWithdrawalRequestBody,
  AdminPatchWithdrawalRequestBody,
} from "@/lib/validations/admin-withdrawal-request";

const wr = withdrawalRequests;
type WR = InferSelectModel<typeof wr>;

export type AdminWithdrawalListRow = WR & {
  userEmail: string;
  userName: string | null;
};

export async function listWithdrawalRequestsWithUsers(): Promise<AdminWithdrawalListRow[]> {
  const u = alias(users, "u");
  return db
    .select({
      id: wr.id,
      userId: wr.userId,
      amount: wr.amount,
      currency: wr.currency,
      status: wr.status,
      destination: wr.destination,
      adminNote: wr.adminNote,
      requestedAt: wr.requestedAt,
      processedAt: wr.processedAt,
      completedAt: wr.completedAt,
      createdAt: wr.createdAt,
      updatedAt: wr.updatedAt,
      userEmail: u.email,
      userName: u.name,
    })
    .from(wr)
    .innerJoin(u, eq(wr.userId, u.id))
    .orderBy(desc(wr.requestedAt));
}

export async function getWithdrawalRequestById(id: string) {
  const u = alias(users, "u");
  const [row] = await db
    .select({
      id: wr.id,
      userId: wr.userId,
      amount: wr.amount,
      currency: wr.currency,
      status: wr.status,
      destination: wr.destination,
      adminNote: wr.adminNote,
      requestedAt: wr.requestedAt,
      processedAt: wr.processedAt,
      completedAt: wr.completedAt,
      createdAt: wr.createdAt,
      updatedAt: wr.updatedAt,
      userEmail: u.email,
      userName: u.name,
    })
    .from(wr)
    .innerJoin(u, eq(wr.userId, u.id))
    .where(eq(wr.id, id))
    .limit(1);
  return row ?? null;
}

export async function createWithdrawalRequest(
  input: AdminCreateWithdrawalRequestBody,
): Promise<WR> {
  const [row] = await db
    .insert(wr)
    .values({
      userId: input.userId,
      amount: input.amount,
      currency: input.currency ?? "USD",
      status: input.status ?? "PENDING",
      destination: input.destination,
      adminNote: input.adminNote ?? null,
    })
    .returning();
  if (!row) {
    throw new Error("Failed to create withdrawal request");
  }
  return row;
}

export async function updateWithdrawalRequest(
  id: string,
  input: AdminPatchWithdrawalRequestBody,
): Promise<WR | null> {
  const updates: Partial<WR> = { updatedAt: new Date() };
  if (input.status !== undefined) updates.status = input.status;
  if (input.adminNote !== undefined) updates.adminNote = input.adminNote;
  if (input.destination !== undefined) updates.destination = input.destination;
  if (input.processedAt !== undefined) {
    updates.processedAt = input.processedAt ? new Date(input.processedAt) : null;
  }
  if (input.completedAt !== undefined) {
    updates.completedAt = input.completedAt ? new Date(input.completedAt) : null;
  }
  const [row] = await db.update(wr).set(updates).where(eq(wr.id, id)).returning();
  return row ?? null;
}

export async function deleteWithdrawalRequest(id: string): Promise<boolean> {
  const [row] = await db.delete(wr).where(eq(wr.id, id)).returning({ id: wr.id });
  return row !== undefined;
}
