"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BellPlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { toast } from "sonner";

import { AdminDataTable } from "@/components/admin-data-table";
import { MockQueryPlaceholder } from "@/components/mock-query-placeholder";
import {
  FullTopSheet,
  FullTopSheetCancelButton,
} from "@/components/ui/full-top-sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchInput } from "@/components/ui/search-input";
import {
  useAdminNotifications,
  useAdminNotificationTargets,
} from "@/hooks/use-admin-queries";
import { isApiSuccess } from "@/lib/http/api-result";
import { adminQueryKeys } from "@/lib/query-keys/admin";
import { openPathInNewTab } from "@/lib/admin/open-links";
import { adminSendNotification } from "@/lib/services/admin-rest";
import { formatDateLong } from "@/lib/format/date";
import type { AdminNotificationRow } from "@/types/api/admin";

export function AdminNotificationsPanel() {
  const qc = useQueryClient();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [scope, setScope] = useState<"USER" | "BROADCAST">("USER");
  const [query, setQuery] = useState("");
  const [userId, setUserId] = useState("");
  const [type, setType] = useState<
    "SYSTEM" | "KYC" | "INVESTMENT" | "WITHDRAWAL" | "GENERAL"
  >("GENERAL");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [href, setHref] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<
    "ALL" | "SYSTEM" | "KYC" | "INVESTMENT" | "WITHDRAWAL" | "GENERAL"
  >("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Reset page when search or filter changes
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleTypeFilterChange = useCallback((value: typeof typeFilter) => {
    setTypeFilter(value);
    setPage(1);
  }, []);

  const { data, isPending, isError, refetch } = useAdminNotifications(
    page,
    pageSize,
    search,
  );
  const notifications = data?.items ?? [];
  const pageCount = Math.max(1, Math.ceil((data?.total ?? 0) / pageSize));
  const { data: targets = [] } = useAdminNotificationTargets(query, 50);

  const copyText = useCallback(async (value: string, label: string) => {
    await navigator.clipboard.writeText(value);
    toast.success(`${label} copied`);
  }, []);

  const selectedUser = useMemo(
    () => targets.find((u) => u.id === userId),
    [targets, userId],
  );

  const mut = useMutation({
    mutationFn: () =>
      adminSendNotification({
        scope,
        userId: scope === "USER" ? userId : undefined,
        type,
        title,
        body: body.trim() || undefined,
        href: href.trim() || undefined,
      }),
    onSuccess: async (res) => {
      if (!isApiSuccess(res)) {
        toast.error(res.error.message);
        return;
      }
      toast.success(`Notification sent to ${res.data.sent} recipient(s)`);
      setTitle("");
      setBody("");
      setHref("");
      setSheetOpen(false);
      await qc.invalidateQueries({ queryKey: ["admin", "notifications"] });
      if (scope === "USER") {
        await qc.invalidateQueries({
          queryKey: adminQueryKeys.notificationTargets("", 50),
        });
      }
    },
    onError: () => toast.error("Failed to send notification"),
  });

  const columns = useMemo<ColumnDef<AdminNotificationRow, unknown>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Title",
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => <Badge variant="outline">{row.original.type}</Badge>,
      },
      {
        accessorKey: "userEmail",
        header: "Recipient",
      },
      {
        accessorKey: "href",
        header: "Link",
        cell: ({ row }) => row.original.href ?? "—",
      },
      {
        accessorKey: "createdAt",
        header: "Sent",
        cell: ({ row }) => formatDateLong(row.original.createdAt),
      },
      {
        accessorKey: "readAt",
        header: "Read",
        cell: ({ row }) => (row.original.readAt ? "Read" : "Unread"),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                aria-label="Actions"
              >
                <MoreHorizontalIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {row.original.href ? (
                <>
                  <DropdownMenuItem
                    onClick={() => {
                      openPathInNewTab(row.original.href!);
                    }}
                  >
                    Open link
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              ) : null}
              <DropdownMenuItem asChild>
                <a href={`mailto:${row.original.userEmail}`}>Email recipient</a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  void copyText(row.original.id, "Notification id")
                }
              >
                Copy notification id
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => void copyText(row.original.userId, "User id")}
              >
                Copy user id
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [copyText],
  );
  const filteredNotifications = useMemo(
    () =>
      notifications.filter(
        (row) => typeFilter === "ALL" || row.type === typeFilter,
      ),
    [notifications, typeFilter],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search title or recipient"
            className="h-9 w-56 bg-white"
          />
          <Select
            value={typeFilter}
            onValueChange={(value) =>
              handleTypeFilterChange(
                value as
                  | "ALL"
                  | "SYSTEM"
                  | "KYC"
                  | "INVESTMENT"
                  | "WITHDRAWAL"
                  | "GENERAL",
              )
            }
          >
            <SelectTrigger className="h-9 w-36 bg-white">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="ALL">All types</SelectItem>
              <SelectItem value="GENERAL">GENERAL</SelectItem>
              <SelectItem value="SYSTEM">SYSTEM</SelectItem>
              <SelectItem value="KYC">KYC</SelectItem>
              <SelectItem value="INVESTMENT">INVESTMENT</SelectItem>
              <SelectItem value="WITHDRAWAL">WITHDRAWAL</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          type="button"
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => setSheetOpen(true)}
        >
          <BellPlusIcon className="size-4" />
          Create notification
        </Button>
      </div>
      <MockQueryPlaceholder
        isPending={isPending}
        isError={isError}
        onRetry={() => void refetch()}
      />
      {!isPending && !isError ? (
        <AdminDataTable columns={columns} data={filteredNotifications} />
      ) : null}
      {!isPending && !isError ? (
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
      ) : null}

      <FullTopSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title="Create notification"
        description="Send a notification to one user or broadcast to all users."
        bodyClassName="gap-4"
        footer={
          <div className="flex w-full flex-wrap items-center justify-between gap-2">
            <FullTopSheetCancelButton onClick={() => setSheetOpen(false)}>
              Cancel
            </FullTopSheetCancelButton>
            <Button
              type="button"
              disabled={
                mut.isPending || !title.trim() || (scope === "USER" && !userId)
              }
              onClick={() => mut.mutate()}
            >
              {mut.isPending ? "Sending..." : "Send notification"}
            </Button>
          </div>
        }
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Send scope</Label>
            <Select
              value={scope}
              onValueChange={(v) => setScope(v as "USER" | "BROADCAST")}
            >
              <SelectTrigger className="h-11 max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">Single user</SelectItem>
                <SelectItem value="BROADCAST">
                  Broadcast to all users
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {scope === "USER" ? (
            <div className="grid gap-3">
              <div className="grid gap-2">
                <Label htmlFor="notif-search">Search user</Label>
                <Input
                  id="notif-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type name or email"
                  className="h-11 max-w-md"
                />
              </div>
              <div className="grid gap-2">
                <Label>Recipient</Label>
                <Select value={userId} onValueChange={setUserId}>
                  <SelectTrigger className="h-11 max-w-xl">
                    <SelectValue placeholder="Select recipient" />
                  </SelectTrigger>
                  <SelectContent>
                    {targets.map((target) => (
                      <SelectItem key={target.id} value={target.id}>
                        {target.name
                          ? `${target.name} (${target.email})`
                          : target.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedUser ? (
                  <p className="text-xs text-muted-foreground">
                    Selected: {selectedUser.name ?? "Unnamed user"} -{" "}
                    {selectedUser.email}
                  </p>
                ) : null}
              </div>
            </div>
          ) : (
            <p className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
              Broadcast sends this notification to every account in the system.
            </p>
          )}

          <div className="grid gap-2">
            <Label>Type</Label>
            <Select
              value={type}
              onValueChange={(v) =>
                setType(
                  v as
                    | "SYSTEM"
                    | "KYC"
                    | "INVESTMENT"
                    | "WITHDRAWAL"
                    | "GENERAL",
                )
              }
            >
              <SelectTrigger className="h-11 max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GENERAL">GENERAL</SelectItem>
                <SelectItem value="SYSTEM">SYSTEM</SelectItem>
                <SelectItem value="KYC">KYC</SelectItem>
                <SelectItem value="INVESTMENT">INVESTMENT</SelectItem>
                <SelectItem value="WITHDRAWAL">WITHDRAWAL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notif-title">Title</Label>
            <Input
              id="notif-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Notification title"
              className="h-11 max-w-2xl"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notif-body">Body (optional)</Label>
            <Input
              id="notif-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Additional message"
              className="h-11 max-w-2xl"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notif-href">Link (optional)</Label>
            <Input
              id="notif-href"
              value={href}
              onChange={(e) => setHref(e.target.value)}
              placeholder="/dashboard/notifications"
              className="h-11 max-w-2xl"
            />
          </div>
        </div>
      </FullTopSheet>
    </div>
  );
}
