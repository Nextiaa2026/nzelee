import { asc, desc, eq, ilike, or, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { notifications, users } from "@/lib/db/schema";
import { createNotification } from "@/lib/services/notifications";
import type { AdminSendNotificationBody } from "@/lib/validations/admin-notification";

type NotificationTarget = {
  id: string;
  name: string | null;
  email: string;
};

type AdminNotificationListRow = {
  id: string;
  userId: string;
  userEmail: string;
  userName: string | null;
  type: "SYSTEM" | "KYC" | "INVESTMENT" | "WITHDRAWAL" | "GENERAL";
  title: string;
  body: string | null;
  href: string | null;
  readAt: Date | null;
  createdAt: Date;
};

export async function listNotificationTargets(params: {
  q?: string;
  limit: number;
}): Promise<NotificationTarget[]> {
  const q = params.q?.trim();

  const where = q
    ? or(ilike(users.email, `%${q}%`), ilike(users.name, `%${q}%`))
    : undefined;

  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
    })
    .from(users)
    .where(where)
    .orderBy(asc(users.email))
    .limit(params.limit);

  return rows;
}

export async function listAdminNotifications(params: {
  page: number;
  pageSize: number;
  search?: string;
}): Promise<{ rows: AdminNotificationListRow[]; total: number; page: number; pageSize: number }> {
  const offset = (params.page - 1) * params.pageSize;
  const searchTerm = params.search?.trim();
  const whereClause =
    searchTerm && searchTerm.length > 0
      ? or(
          ilike(notifications.title, `%${searchTerm}%`),
          ilike(users.email, `%${searchTerm}%`),
          ilike(sql`COALESCE(${users.name}, '')`, `%${searchTerm}%`),
        )
      : undefined;
  const [countRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(notifications)
    .innerJoin(users, eq(users.id, notifications.userId))
    .where(whereClause);
  const rows = await db
    .select({
      id: notifications.id,
      userId: notifications.userId,
      userEmail: users.email,
      userName: users.name,
      type: notifications.type,
      title: notifications.title,
      body: notifications.body,
      href: notifications.href,
      readAt: notifications.readAt,
      createdAt: notifications.createdAt,
    })
    .from(notifications)
    .innerJoin(users, eq(users.id, notifications.userId))
    .where(whereClause)
    .orderBy(desc(notifications.createdAt))
    .limit(params.pageSize)
    .offset(offset);
  return {
    rows,
    total: countRow?.count ?? 0,
    page: params.page,
    pageSize: params.pageSize,
  };
}

export async function sendAdminNotification(input: AdminSendNotificationBody): Promise<{
  sent: number;
}> {
  const title = input.title.trim();
  const body = input.body?.trim() || null;
  const href = input.href?.trim() || null;

  if (input.scope === "USER" && input.userId) {
    await createNotification({
      userId: input.userId,
      type: input.type,
      title,
      body,
      href,
      metadata: { sender: "ADMIN" },
    });
    return { sent: 1 };
  }

  const targets = await db.select({ id: users.id }).from(users);
  for (const target of targets) {
    await createNotification({
      userId: target.id,
      type: input.type,
      title,
      body,
      href,
      metadata: { sender: "ADMIN", broadcast: true },
    });
  }

  return { sent: targets.length };
}
