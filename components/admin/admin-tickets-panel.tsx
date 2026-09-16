"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
  EyeIcon,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { AdminDataTable } from "@/components/admin-data-table";
import { MockQueryPlaceholder } from "@/components/mock-query-placeholder";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDateLong } from "@/lib/format/date";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchInput } from "@/components/ui/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";

type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

type TicketRow = {
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

type TicketsListResponse = {
  items: TicketRow[];
  total: number;
};

async function fetchTickets(params: {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
}): Promise<TicketsListResponse> {
  const searchParams = new URLSearchParams({
    page: params.page.toString(),
    pageSize: params.pageSize.toString(),
  });
  if (params.search) searchParams.set("search", params.search);
  if (params.status && params.status !== "ALL")
    searchParams.set("status", params.status);

  const res = await fetch(`/api/v1/admin/tickets?${searchParams.toString()}`, {
    credentials: "include",
  });
  const json = await res.json();
  if (json.ok && json.data) {
    return json.data;
  }
  throw new Error(json.error?.message ?? "Failed to fetch tickets");
}

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

async function copyText(value: string, label: string) {
  await navigator.clipboard.writeText(value);
  toast.success(`${label} copied`);
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

export function AdminTicketsPanel() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | TicketStatus>("ALL");
  const [page, setPage] = useState(1);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [viewingTicket, setViewingTicket] = useState<TicketRow | null>(null);
  const [editStatus, setEditStatus] = useState<TicketStatus>("OPEN");
  const [editPriority, setEditPriority] = useState<TicketPriority>("LOW");
  const [editAdminNotes, setEditAdminNotes] = useState("");
  const pageSize = 20;

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["admin", "tickets", { page, pageSize, search, statusFilter }],
    queryFn: () =>
      fetchTickets({
        page,
        pageSize,
        search: search || undefined,
        status: statusFilter,
      }),
  });

  const rows = useMemo<TicketRow[]>(() => data?.items ?? [], [data]);
  const total = data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  const openView = useCallback((ticket: TicketRow) => {
    setViewingTicket(ticket);
    setEditStatus(ticket.status);
    setEditPriority(ticket.priority);
    setEditAdminNotes(ticket.adminNotes ?? "");
    setSheetOpen(true);
  }, []);

  const updateMutation = useMutation({
    mutationFn: (data: {
      status?: TicketStatus;
      priority?: TicketPriority;
      adminNotes?: string;
    }) => {
      if (!viewingTicket) throw new Error("No ticket selected");
      return updateTicket(viewingTicket.id, data);
    },
    onSuccess: () => {
      toast.success("Ticket updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "tickets"] });
      setSheetOpen(false);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update ticket",
      );
    },
  });

  const handleSave = () => {
    if (!viewingTicket) return;
    updateMutation.mutate({
      status: editStatus,
      priority: editPriority,
      adminNotes: editAdminNotes.trim() || undefined,
    });
  };

  const hasChanges =
    viewingTicket &&
    (editStatus !== viewingTicket.status ||
      editPriority !== viewingTicket.priority ||
      editAdminNotes !== (viewingTicket.adminNotes ?? ""));

  const columns = useMemo<ColumnDef<TicketRow, unknown>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground">
            {row.original.id.slice(0, 8)}
          </span>
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className={statusColors[row.original.status]}
          >
            {row.original.status.replace("_", " ")}
          </Badge>
        ),
      },
      {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className={priorityColors[row.original.priority]}
          >
            {row.original.priority}
          </Badge>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => formatDateLong(row.original.createdAt),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                aria-label="Actions"
              >
                <MoreHorizontalIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => openView(row.original)}>
                <EyeIcon className="mr-2 size-4" />
                View details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href={`mailto:${row.original.email}`}>Email user</a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => void copyText(row.original.id, "Ticket ID")}
              >
                Copy ticket ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => void copyText(row.original.email, "Email")}
              >
                Copy email
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [openView],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search email or message"
            className="h-9 w-72 rounded-md bg-white"
          />
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value as "ALL" | TicketStatus);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-36 rounded-md bg-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="ALL">All status</SelectItem>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-foreground/60">
          {total} ticket{total !== 1 ? "s" : ""}
        </p>
      </div>

      <MockQueryPlaceholder
        isPending={isPending}
        isError={isError}
        onRetry={() => void refetch()}
      />

      {!isPending && !isError && data ? (
        <>
          <AdminDataTable columns={columns} data={rows} />
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-8"
              aria-label="Previous page"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeftIcon className="size-4" />
            </Button>
            <p className="text-xs text-black/60">
              Page {page} of {pageCount}
            </p>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-8"
              aria-label="Next page"
              disabled={page >= pageCount}
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            >
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>
        </>
      ) : null}

      <Sheet
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) setViewingTicket(null);
        }}
      >
        <SheetContent
          side="right"
          className="flex w-full flex-col gap-0 overflow-y-auto bg-white p-0 sm:max-w-lg"
        >
          <SheetHeader className="border-b px-6 py-4 text-left">
            <SheetTitle>
              Ticket #{viewingTicket?.id.slice(0, 8) ?? ""}
            </SheetTitle>
            <SheetDescription>
              Consultez le ticket et mettez à jour le statut, la priorité ou les
              notes admin.
            </SheetDescription>
          </SheetHeader>
          {viewingTicket && (
            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-4">
              <div className="rounded-lg border bg-card p-4">
                <div className="mb-4 flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-semibold">Informations</h3>
                    <p className="text-sm text-muted-foreground">
                      ID: {viewingTicket.id}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className={statusColors[viewingTicket.status]}
                    >
                      {viewingTicket.status.replace("_", " ")}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={priorityColors[viewingTicket.priority]}
                    >
                      {viewingTicket.priority}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Nom
                    </Label>
                    <p className="mt-1">{viewingTicket.name}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Email
                    </Label>
                    <p className="mt-1">
                      <a
                        href={`mailto:${viewingTicket.email}`}
                        className="text-deep-green hover:underline"
                      >
                        {viewingTicket.email}
                      </a>
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Message
                    </Label>
                    <p className="mt-1 whitespace-pre-wrap rounded-md bg-muted/50 p-3">
                      {viewingTicket.message}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Créé
                      </Label>
                      <p className="mt-1">
                        {formatDateLong(viewingTicket.createdAt)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Mis à jour
                      </Label>
                      <p className="mt-1">
                        {formatDateLong(viewingTicket.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-card p-4">
                <h3 className="mb-4 text-base font-semibold">
                  Mettre à jour
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Statut</Label>
                    <Select
                      value={editStatus}
                      onValueChange={(value) =>
                        setEditStatus(value as TicketStatus)
                      }
                    >
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OPEN">Ouvert</SelectItem>
                        <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                        <SelectItem value="RESOLVED">Résolu</SelectItem>
                        <SelectItem value="CLOSED">Fermé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priorité</Label>
                    <Select
                      value={editPriority}
                      onValueChange={(value) =>
                        setEditPriority(value as TicketPriority)
                      }
                    >
                      <SelectTrigger id="priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Basse</SelectItem>
                        <SelectItem value="MEDIUM">Moyenne</SelectItem>
                        <SelectItem value="HIGH">Haute</SelectItem>
                        <SelectItem value="URGENT">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminNotes">Notes admin</Label>
                    <textarea
                      id="adminNotes"
                      value={editAdminNotes}
                      onChange={(e) => setEditAdminNotes(e.target.value)}
                      className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Notes internes sur ce ticket…"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <SheetFooter className="border-t px-6 py-4 sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSheetOpen(false)}
            >
              Fermer
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || updateMutation.isPending}
            >
              {updateMutation.isPending ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
