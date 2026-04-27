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
import { adminQueryKeys } from "@/lib/query-keys/admin";
import { adminPatchKycSubmission } from "@/lib/services/admin-rest";
import type { AdminKycSubmissionRow } from "@/types/api/admin";

export function AdminKycSubmissionsTable({ data }: { data: AdminKycSubmissionRow[] }) {
  const qc = useQueryClient();

  const patchMut = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "EXPIRED";
    }) =>
      adminPatchKycSubmission(id, {
        status,
        rejectionReason: status === "REJECTED" ? "Rejected by admin" : null,
      }),
    onSuccess: async (res) => {
      if (!isApiSuccess(res)) {
        toast.error(res.error.message);
        return;
      }
      toast.success("KYC decision updated");
      await qc.invalidateQueries({ queryKey: adminQueryKeys.kycSubmissions() });
    },
    onError: () => toast.error("Failed to update KYC"),
  });

  const columns = useMemo<ColumnDef<AdminKycSubmissionRow, unknown>[]>(
    () => [
      {
        accessorKey: "userEmail",
        header: "User",
      },
      {
        accessorKey: "documentType",
        header: "Document",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Badge variant="outline">{row.original.status}</Badge>
            <Select
              value={row.original.status}
              onValueChange={(status) =>
                patchMut.mutate({
                  id: row.original.id,
                  status: status as "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "EXPIRED",
                })
              }
            >
              <SelectTrigger className="h-8 w-[170px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">PENDING</SelectItem>
                <SelectItem value="UNDER_REVIEW">UNDER_REVIEW</SelectItem>
                <SelectItem value="APPROVED">APPROVED</SelectItem>
                <SelectItem value="REJECTED">REJECTED</SelectItem>
                <SelectItem value="EXPIRED">EXPIRED</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ),
      },
      {
        accessorKey: "countryOfResidence",
        header: "Residence",
        cell: ({ row }) => row.original.countryOfResidence ?? "—",
      },
      {
        accessorKey: "submittedAt",
        header: "Submitted",
        cell: ({ row }) => new Date(row.original.submittedAt).toLocaleDateString(),
      },
      {
        accessorKey: "reviewedAt",
        header: "Reviewed",
        cell: ({ row }) =>
          row.original.reviewedAt ? new Date(row.original.reviewedAt).toLocaleDateString() : "—",
      },
    ],
    [patchMut],
  );

  return <AdminDataTable columns={columns} data={data} />;
}
