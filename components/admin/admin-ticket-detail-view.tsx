"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

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

type AdminTicketDetailViewProps = {
  ticket: Ticket;
};

async function updateTicket(
  ticketId: string,
  data: {
    status?: TicketStatus;
    priority?: TicketPriority;
    adminNotes?: string;
  },
) {
  const res = await fetch(`/api/v1/admin/tickets/${ticketId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error?.message ?? "Failed to update ticket");
  }
  return json.data;
}

const statusColors: Record<TicketStatus, string> = {
  OPEN: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  IN_PROGRESS: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  RESOLVED: "bg-green-500/10 text-green-600 border-green-500/20",
  CLOSED: "bg-gray-500/10 text-gray-600 border-gray-500/20",
};

const priorityColors: Record<TicketPriority, string> = {
  LOW: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  MEDIUM: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  HIGH: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  URGENT: "bg-red-500/10 text-red-600 border-red-500/20",
};

export function AdminTicketDetailView({ ticket }: AdminTicketDetailViewProps) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<TicketStatus>(ticket.status);
  const [priority, setPriority] = useState<TicketPriority>(ticket.priority);
  const [adminNotes, setAdminNotes] = useState(ticket.adminNotes ?? "");

  const updateMutation = useMutation({
    mutationFn: (data: {
      status?: TicketStatus;
      priority?: TicketPriority;
      adminNotes?: string;
    }) => updateTicket(ticket.id, data),
    onSuccess: () => {
      toast.success("Ticket updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "tickets"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "ticket", ticket.id],
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update ticket",
      );
    },
  });

  const handleSave = () => {
    updateMutation.mutate({
      status,
      priority,
      adminNotes: adminNotes.trim() || undefined,
    });
  };

  const hasChanges =
    status !== ticket.status ||
    priority !== ticket.priority ||
    adminNotes !== (ticket.adminNotes ?? "");

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold">Ticket Details</h2>
            <p className="text-sm text-muted-foreground">
              ID: {ticket.id.slice(0, 8)}
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className={statusColors[ticket.status]}>
              {ticket.status.replace("_", " ")}
            </Badge>
            <Badge
              variant="outline"
              className={priorityColors[ticket.priority]}
            >
              {ticket.priority}
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">
              Name
            </Label>
            <p className="mt-1">{ticket.name}</p>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground">
              Email
            </Label>
            <p className="mt-1">
              <a
                href={`mailto:${ticket.email}`}
                className="text-blue-600 hover:underline"
              >
                {ticket.email}
              </a>
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground">
              Message
            </Label>
            <p className="mt-1 whitespace-pre-wrap rounded-md bg-muted/50 p-3">
              {ticket.message}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Created
              </Label>
              <p className="mt-1">
                {new Date(ticket.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Updated
              </Label>
              <p className="mt-1">
                {new Date(ticket.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold">Update Ticket</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as TicketStatus)}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={priority}
              onValueChange={(value) => setPriority(value as TicketPriority)}
            >
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminNotes">Admin Notes</Label>
            <textarea
              id="adminNotes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Add internal notes about this ticket..."
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={!hasChanges || updateMutation.isPending}
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
