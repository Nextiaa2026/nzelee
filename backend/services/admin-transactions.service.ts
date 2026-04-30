import { desc, eq, getTableColumns, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { campaigns, paymentTransactions } from "@/lib/db/schema";

export async function listPaymentTransactions(params: {
  page: number;
  pageSize: number;
  search?: string;
  startDate?: string;
  endDate?: string;
}) {
  const offset = (params.page - 1) * params.pageSize;
  const { and, gte, lte, or, ilike } = await import("drizzle-orm");
  const where = and(
    params.startDate ? gte(paymentTransactions.createdAt, new Date(params.startDate)) : undefined,
    params.endDate ? lte(paymentTransactions.createdAt, new Date(params.endDate)) : undefined,
    params.search
      ? or(
          ilike(paymentTransactions.description, `%${params.search}%`),
          ilike(paymentTransactions.id, `%${params.search}%`),
          ilike(campaigns.title, `%${params.search}%`),
        )
      : undefined,
  );

  const [countRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(paymentTransactions)
    .innerJoin(campaigns, eq(paymentTransactions.campaignId, campaigns.id))
    .where(where);
  const txCols = getTableColumns(paymentTransactions);
  const rows = await db
    .select({
      ...txCols,
      campaignSlug: campaigns.slug,
      campaignTitle: campaigns.title,
    })
    .from(paymentTransactions)
    .innerJoin(campaigns, eq(paymentTransactions.campaignId, campaigns.id))
    .where(where)
    .orderBy(desc(paymentTransactions.createdAt))
    .limit(params.pageSize)
    .offset(offset);
  return {
    rows,
    total: countRow?.count ?? 0,
    page: params.page,
    pageSize: params.pageSize,
  };
}

export async function getPaymentTransactionById(id: string) {
  const [row] = await db
    .select()
    .from(paymentTransactions)
    .where(eq(paymentTransactions.id, id))
    .limit(1);
  return row ?? null;
}
