import { count, desc, eq, ilike, or, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import type { AdminPatchUserBody } from "@/lib/validations/admin-users";

export async function listUsers(options: {
  page: number;
  pageSize: number;
  search?: string;
}) {
  const { page, pageSize, search } = options;
  const offset = (page - 1) * pageSize;

  const where =
    search && search.length > 0
      ? or(
          ilike(users.email, `%${search}%`),
          ilike(sql`COALESCE(${users.name}, '')`, `%${search}%`),
        )
      : undefined;

  const [totalRow] = await db.select({ n: count() }).from(users).where(where);
  const total = Number(totalRow?.n ?? 0);

  const rows = await db
    .select()
    .from(users)
    .where(where)
    .orderBy(desc(users.createdAt))
    .limit(pageSize)
    .offset(offset);

  return { rows, total, page, pageSize };
}

export async function getUserById(id: string) {
  const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return row ?? null;
}

export async function updateUser(id: string, body: AdminPatchUserBody) {
  const [row] = await db
    .update(users)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  return row ?? null;
}
