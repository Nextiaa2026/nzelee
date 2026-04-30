import { desc, eq, sql } from "drizzle-orm";

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

export async function listWithdrawalRequestsWithUsers(params: {
  page: number;
  pageSize: number;
}): Promise<{ rows: AdminWithdrawalListRow[]; total: number; page: number; pageSize: number }> {
  const u = alias(users, "u");
  const offset = (params.page - 1) * params.pageSize;
  const [countRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(wr);
  const rows = await db
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
    .orderBy(desc(wr.requestedAt))
    .limit(params.pageSize)
    .offset(offset);
  return {
    rows,
    total: countRow?.count ?? 0,
    page: params.page,
    pageSize: params.pageSize,
  };
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
  /** Only end users may receive non-pending statuses via admin PATCH after review. */
  const [row] = await db
    .insert(wr)
    .values({
      userId: input.userId,
      amount: input.amount,
      currency: input.currency ?? "USD",
      status: "PENDING",
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
  ctx?: { actorAdminId: string },
): Promise<WR | null> {
  const existing = await getWithdrawalRequestById(id);
  if (!existing) {
    return null;
  }
  const previousStatus = existing.status;

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
  if (!row) {
    return null;
  }

  if (ctx?.actorAdminId && input.status !== undefined && input.status !== previousStatus) {
    try {
      const { onWithdrawalStatusUpdatedByAdmin } = await import(
        "@/lib/services/flow-notifications"
      );
      await onWithdrawalStatusUpdatedByAdmin({
        requestUserId: row.userId,
        userEmail: existing.userEmail,
        actorAdminId: ctx.actorAdminId,
        withdrawalId: row.id,
        previousStatus,
        newStatus: input.status,
        amountCents: row.amount,
        currency: row.currency,
        adminNote: row.adminNote ?? null,
      });
    } catch (e) {
      console.error("[withdrawals] notification side-effect failed", e);
    }
  }

  return row;
}

export async function deleteWithdrawalRequest(id: string): Promise<boolean> {
  const [row] = await db.delete(wr).where(eq(wr.id, id)).returning({ id: wr.id });
  return row !== undefined;
}
