import { and, count, desc, eq, isNull } from "drizzle-orm";

import { db } from "@/lib/db";
import { notifications, users } from "@/lib/db/schema";

export type NotificationType = (typeof notifications.$inferSelect)["type"];

export type NotificationRecord = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string | null;
  href: string | null;
  readAt: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
};

function toRecord(row: typeof notifications.$inferSelect): NotificationRecord {
  return {
    id: row.id,
    userId: row.userId,
    type: row.type,
    title: row.title,
    body: row.body ?? null,
    href: row.href ?? null,
    readAt: row.readAt ? row.readAt.toISOString() : null,
    metadata: row.metadata ?? null,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function listNotificationsForUser(
  userId: string,
  limit = 50,
): Promise<NotificationRecord[]> {
  const rows = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
  return rows.map(toRecord);
}

export async function countUnreadNotificationsForUser(userId: string): Promise<number> {
  const [row] = await db
    .select({ n: count() })
    .from(notifications)
    .where(and(eq(notifications.userId, userId), isNull(notifications.readAt)));
  return row?.n ?? 0;
}

export async function markNotificationReadForUser(
  userId: string,
  notificationId: string,
): Promise<boolean> {
  const updated = await db
    .update(notifications)
    .set({ readAt: new Date() })
    .where(
      and(
        eq(notifications.id, notificationId),
        eq(notifications.userId, userId),
        isNull(notifications.readAt),
      ),
    )
    .returning({ id: notifications.id });
  return updated.length > 0;
}

export async function createNotification(input: {
  userId: string;
  type?: NotificationType;
  title: string;
  body?: string | null;
  href?: string | null;
  metadata?: Record<string, unknown> | null;
}): Promise<NotificationRecord> {
  const [row] = await db
    .insert(notifications)
    .values({
      userId: input.userId,
      type: input.type ?? "GENERAL",
      title: input.title.trim(),
      body: input.body?.trim() || null,
      href: input.href?.trim() || null,
      metadata: input.metadata ?? null,
    })
    .returning();
  if (!row) {
    throw new Error("Failed to create notification");
  }
  return toRecord(row);
}

/**
 * Send a notification to all administrators.
 */
export async function notifyAdmins(input: {
  type: NotificationType;
  title: string;
  body?: string | null;
  href?: string | null;
  metadata?: Record<string, unknown>;
}) {
  const admins = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.role, "ADMIN"));

  if (admins.length === 0) return;

  const values = admins.map((admin) => ({
    userId: admin.id,
    type: input.type,
    title: input.title.trim(),
    body: input.body?.trim() || null,
    href: input.href?.trim() || null,
    metadata: { ...input.metadata, isAdminNotification: true },
  }));

  await db.insert(notifications).values(values);
}

