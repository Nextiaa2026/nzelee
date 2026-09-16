"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { AdminTicketDetailView } from "@/components/admin/admin-ticket-detail-view";
import { MockQueryPlaceholder } from "@/components/mock-query-placeholder";

type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

type Ticket = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: TicketStatus;
  priority: TicketPriority;
  adminNotes: string | null;
  adminUserId: string | null;
  createdAt: string;
  updatedAt: string;
};

async function fetchTicket(ticketId: string): Promise<Ticket> {
  const res = await fetch(`/api/v1/admin/tickets/${ticketId}`, {
    credentials: "include",
  });
  const json = await res.json();
  if (json.ok && json.data) {
    return json.data as Ticket;
  }
  throw new Error(json.error?.message ?? "Failed to fetch ticket");
}

export default function AdminTicketDetailPage() {
  const params = useParams<{ id: string }>();
  const ticketId = params.id;

  const { data: ticket, isPending, isError, refetch } = useQuery({
    queryKey: ["admin", "ticket", ticketId],
    queryFn: () => fetchTicket(ticketId),
    enabled: Boolean(ticketId),
  });

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:py-6 lg:px-6">
      <div className="flex items-center gap-2">
        <Link
          href="/admin/tickets"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Retour aux tickets
        </Link>
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">
        Ticket de support
        {ticket ? ` #${ticket.id.slice(0, 8)}` : null}
      </h1>

      <MockQueryPlaceholder
        isPending={isPending}
        isError={isError}
        onRetry={() => void refetch()}
      />

      {!isPending && !isError && ticket ? (
        <AdminTicketDetailView
          key={`${ticket.id}-${ticket.updatedAt}`}
          ticket={ticket}
        />
      ) : null}
    </div>
  );
}
