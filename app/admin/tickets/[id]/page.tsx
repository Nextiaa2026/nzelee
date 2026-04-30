import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminTicketDetailView } from "@/components/admin/admin-ticket-detail-view";

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

async function getTicket(id: string): Promise<Ticket | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/v1/admin/tickets/${id}`,
      {
        cache: "no-store",
        credentials: "include",
      },
    );

    if (!res.ok) {
      return null;
    }

    const json = await res.json();
    return json.ok && json.data ? json.data : null;
  } catch {
    return null;
  }
}

export default async function AdminTicketDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const ticket = await getTicket(params.id);

  if (!ticket) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:py-6 lg:px-6">
      <div className="flex items-center gap-2">
        <Link
          href="/admin/tickets"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to tickets
        </Link>
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">
        Support Ticket #{ticket.id.slice(0, 8)}
      </h1>
      <AdminTicketDetailView ticket={ticket} />
    </div>
  );
}
