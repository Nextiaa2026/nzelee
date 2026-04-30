import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { supportTickets } from "@/lib/db/schema";
import type {
  CreateTicketInput,
  UpdateTicketInput,
  ListTicketsQuery,
} from "@/lib/validations/ticket";

export interface TicketRecord {
  id: string;
  name: string;
  email: string;
  message: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  adminNotes: string | null;
  adminUserId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedTickets {
  items: TicketRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function createTicket(
  input: CreateTicketInput,
): Promise<TicketRecord> {
  const [ticket] = await db
    .insert(supportTickets)
    .values({
      name: input.name,
      email: input.email,
      message: input.message,
      status: "OPEN",
      priority: "MEDIUM",
    })
    .returning();

  if (!ticket) {
    throw new Error("Failed to create ticket");
  }

  return ticket as TicketRecord;
}

export async function listTickets(
  query: ListTicketsQuery,
): Promise<PaginatedTickets> {
  const { page, limit, status, search } = query;
  const offset = (page - 1) * limit;

  // Build where conditions
  const conditions = [];

  if (status && status !== "ALL") {
    conditions.push(eq(supportTickets.status, status));
  }

  if (search) {
    conditions.push(
      or(
        ilike(supportTickets.email, `%${search}%`),
        ilike(supportTickets.message, `%${search}%`),
        ilike(supportTickets.name, `%${search}%`),
      ),
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Get total count
  const [countResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(supportTickets)
    .where(whereClause);

  const total = countResult?.count ?? 0;

  // Get paginated results
  const items = await db
    .select()
    .from(supportTickets)
    .where(whereClause)
    .orderBy(desc(supportTickets.createdAt))
    .limit(limit)
    .offset(offset);

  return {
    items: items as TicketRecord[],
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getTicketById(id: string): Promise<TicketRecord | null> {
  const [ticket] = await db
    .select()
    .from(supportTickets)
    .where(eq(supportTickets.id, id))
    .limit(1);

  return ticket ? (ticket as TicketRecord) : null;
}

export async function updateTicket(
  id: string,
  input: UpdateTicketInput,
  adminUserId: string,
): Promise<TicketRecord | null> {
  const [ticket] = await db
    .update(supportTickets)
    .set({
      ...input,
      adminUserId,
      updatedAt: new Date(),
    })
    .where(eq(supportTickets.id, id))
    .returning();

  return ticket ? (ticket as TicketRecord) : null;
}
