"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontalIcon } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

import { AdminDataTable } from "@/components/admin-data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isApiSuccess } from "@/lib/http/api-result";
import { formatCentsToUsd } from "@/lib/money";
import { formatDateLong } from "@/lib/format/date";
import { adminQueryKeys } from "@/lib/query-keys/admin";
import {
  adminDeleteWithdrawalRequest,
  adminPatchWithdrawalRequest,
} from "@/lib/services/admin-rest";
import type { AdminWithdrawalListRow } from "@/types/api/admin";

export function AdminWithdrawalsTable({
  data,
}: {
  data: AdminWithdrawalListRow[];
}) {
  const qc = useQueryClient();
  const copyText = async (value: string, label: string) => {
    await navigator.clipboard.writeText(value);
    toast.success(`${label} copied`);
  };

  const patchMut = useMutation({
    mutationFn: ({
      id,
      status,
      adminNote,
    }: {
      id: string;
      status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "CANCELLED";
      adminNote?: string | null;
    }) =>
      adminPatchWithdrawalRequest(id, {
        status,
        adminNote,
        processedAt:
          status === "APPROVED" || status === "REJECTED"
            ? new Date().toISOString()
            : null,
        completedAt: status === "COMPLETED" ? new Date().toISOString() : null,
      }),
    onSuccess: async (res) => {
      if (!isApiSuccess(res)) {
        toast.error(res.error.message);
        return;
      }
      toast.success("Withdrawal updated");
      await qc.invalidateQueries({
        queryKey: adminQueryKeys.withdrawalRequests(),
      });
    },
    onError: () => toast.error("Failed to update withdrawal"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => adminDeleteWithdrawalRequest(id),
    onSuccess: async (res) => {
      if (!isApiSuccess(res)) {
        toast.error(res.error.message);
        return;
      }
      toast.success("Withdrawal request deleted");
      await qc.invalidateQueries({
        queryKey: adminQueryKeys.withdrawalRequests(),
      });
    },
    onError: () => toast.error("Failed to delete withdrawal request"),
  });

  const columns = useMemo<ColumnDef<AdminWithdrawalListRow, unknown>[]>(
    () => [
      {
        accessorKey: "userEmail",
        header: "User",
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => formatCentsToUsd(row.original.amount),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="font-normal">
              {row.original.status}
            </Badge>
            <Select
              value={row.original.status}
              onValueChange={(status) => {
                const s = status as
                  | "PENDING"
                  | "APPROVED"
                  | "REJECTED"
                  | "COMPLETED"
                  | "CANCELLED";
                let adminNote: string | null | undefined = undefined;
                if (s === "REJECTED") {
                  const r =
                    typeof window !== "undefined"
                      ? window.prompt(
                          "Optional rejection note (shown to the user in their notification):",
                        )
                      : null;
                  adminNote = r && r.trim() !== "" ? r.trim() : null;
                }
                patchMut.mutate({ id: row.original.id, status: s, adminNote });
              }}
            >
              <SelectTrigger className="h-8 w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">PENDING</SelectItem>
                <SelectItem value="APPROVED">APPROVED</SelectItem>
                <SelectItem value="REJECTED">REJECTED</SelectItem>
                <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                <SelectItem value="CANCELLED">CANCELLED</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ),
      },
      {
        accessorKey: "destination",
        header: "Destination",
      },
      {
        accessorKey: "requestedAt",
        header: "Requested",
        cell: ({ row }) => formatDateLong(row.original.requestedAt),
      },
      {
        accessorKey: "completedAt",
        header: "Completed",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {formatDateLong(row.original.completedAt) || "—"}
          </span>
        ),
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
              >
                <MoreHorizontalIcon className="size-4" />
                <span className="sr-only">Open actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <a href={`mailto:${row.original.userEmail}`}>Email user</a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => void copyText(row.original.id, "Withdrawal id")}
              >
                Copy withdrawal id
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => void copyText(row.original.userId, "User id")}
              >
                Copy user id
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => {
                  if (
                    !window.confirm(
                      "Delete this withdrawal request? This cannot be undone.",
                    )
                  ) {
                    return;
                  }
                  deleteMut.mutate(row.original.id);
                }}
              >
                Delete request
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [deleteMut, patchMut],
  );

  return <AdminDataTable columns={columns} data={data} />;
}
