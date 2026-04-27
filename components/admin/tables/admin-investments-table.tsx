"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "sonner";

import { AdminDataTable } from "@/components/admin-data-table";
import { Badge } from "@/components/ui/badge";
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
import { adminPatchPledgeStatus } from "@/lib/services/admin-rest";
import type { AdminPledgeListRow } from "@/types/api/admin";

export function AdminInvestmentsTable({
  data,
}: {
  data: AdminPledgeListRow[];
}) {
  const qc = useQueryClient();

  const patchStatusMut = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
    }) => adminPatchPledgeStatus(id, { status }),
    onSuccess: async (res) => {
      if (!isApiSuccess(res)) {
        toast.error(res.error.message);
        return;
      }
      toast.success("Investment status updated");
      await qc.invalidateQueries({ queryKey: adminQueryKeys.pledges() });
    },
    onError: () => toast.error("Failed to update investment status"),
  });

  const columns = useMemo<ColumnDef<AdminPledgeListRow, unknown>[]>(
    () => [
      {
        accessorKey: "campaignTitle",
        header: "Listing",
      },
      {
        accessorKey: "backerEmail",
        header: "Investor",
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
            <Badge variant="outline" className="font-normal">
              {row.original.status}
            </Badge>
            <Select
              value={row.original.status}
              onValueChange={(status) =>
                patchStatusMut.mutate({
                  id: row.original.id,
                  status: status as "PENDING" | "PAID" | "FAILED" | "REFUNDED",
                })
              }
            >
              <SelectTrigger className="h-8 w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">PENDING</SelectItem>
                <SelectItem value="PAID">PAID</SelectItem>
                <SelectItem value="FAILED">FAILED</SelectItem>
                <SelectItem value="REFUNDED">REFUNDED</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ),
      },
    ],
    [patchStatusMut],
  );

  return <AdminDataTable columns={columns} data={data} />;
}
