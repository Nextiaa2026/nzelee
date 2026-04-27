import { eq } from "drizzle-orm";

import { db } from "../../lib/db";
import { users } from "../../lib/db/schema";
import { hashPassword } from "../../lib/security/password";

export async function findUserByEmail(email: string) {
  const [row] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return row ?? null;
}

export async function emailExists(email: string) {
  const user = await findUserByEmail(email);
  return user !== null;
}

export async function createUserWithPassword(params: {
  name: string;
  email: string;
  password: string;
}): Promise<string> {
  const passwordHash = await hashPassword(params.password);
  const [inserted] = await db
    .insert(users)
    .values({
      name: params.name,
      email: params.email,
      passwordHash,
    })
    .returning({ id: users.id });
  if (!inserted) {
    throw new Error("Failed to create user");
  }
  return inserted.id;
}

export async function updateUserPassword(userId: string, plainPassword: string) {
  const passwordHash = await hashPassword(plainPassword);
  await db
    .update(users)
    .set({
      passwordHash,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));
}

export async function markEmailVerified(userId: string) {
  await db
    .update(users)
    .set({
      emailVerified: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));
}
