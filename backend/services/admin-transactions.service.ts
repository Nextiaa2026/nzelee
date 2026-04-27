import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { paymentTransactions } from "@/lib/db/schema";

export async function listPaymentTransactions() {
  return db.select().from(paymentTransactions).orderBy(desc(paymentTransactions.createdAt));
}

export async function getPaymentTransactionById(id: string) {
  const [row] = await db
    .select()
    .from(paymentTransactions)
    .where(eq(paymentTransactions.id, id))
    .limit(1);
  return row ?? null;
}
