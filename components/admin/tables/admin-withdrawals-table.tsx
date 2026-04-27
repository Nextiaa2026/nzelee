"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

import { AdminDataTable } from "@/components/admin-data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isApiSuccess } from "@/lib/http/api-result";
import { formatCentsToUsd } from "@/lib/money";
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

  const patchMut = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "CANCELLED";
    }) =>
      adminPatchWithdrawalRequest(id, {
        status,
        processedAt: status === "APPROVED" || status === "REJECTED" ? new Date().toISOString() : null,
        completedAt: status === "COMPLETED" ? new Date().toISOString() : null,
      }),
    onSuccess: async (res) => {
      if (!isApiSuccess(res)) {
        toast.error(res.error.message);
        return;
      }
      toast.success("Withdrawal updated");
      await qc.invalidateQueries({ queryKey: adminQueryKeys.withdrawalRequests() });
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
      await qc.invalidateQueries({ queryKey: adminQueryKeys.withdrawalRequests() });
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
              onValueChange={(status) =>
                patchMut.mutate({
                  id: row.original.id,
                  status: status as "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "CANCELLED",
                })
              }
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
        cell: ({ row }) => new Date(row.original.requestedAt).toLocaleDateString(),
      },
      {
        accessorKey: "completedAt",
        header: "Completed",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.completedAt
              ? new Date(row.original.completedAt).toLocaleDateString()
              : "—"}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Delete withdrawal request"
            onClick={() => deleteMut.mutate(row.original.id)}
          >
            <Trash2Icon className="size-4 text-destructive" />
          </Button>
        ),
      },
    ],
    [deleteMut, patchMut],
  );

  return <AdminDataTable columns={columns} data={data} />;
}
