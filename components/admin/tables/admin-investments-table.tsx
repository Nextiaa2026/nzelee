"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { cn } from "@/lib/utils";
import { adminQueryKeys } from "@/lib/query-keys/admin";
import { openPublicCampaign } from "@/lib/admin/open-links";
import { adminPatchPledgeStatus } from "@/lib/services/admin-rest";
import type { AdminPledgeListRow } from "@/types/api/admin";
import { MoreHorizontalIcon } from "lucide-react";

export function AdminInvestmentsTable({
  data,
}: {
  data: AdminPledgeListRow[];
}) {
  const qc = useQueryClient();
  const copyText = async (value: string, label: string) => {
    await navigator.clipboard.writeText(value);
    toast.success(`${label} copied`);
  };

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
        cell: ({ row }) => {
          const statusColors: Record<string, string> = {
            PENDING: "bg-amber-500/10 text-amber-600 border-amber-500/20",
            PAID: "bg-green-500/10 text-green-600 border-green-500/20",
            FAILED: "bg-red-500/10 text-red-600 border-red-500/20",
            REFUNDED: "bg-slate-500/10 text-slate-600 border-slate-500/20",
          };
          const colorClass =
            statusColors[row.original.status] ||
            "bg-muted text-muted-foreground border-border";

          return (
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn("font-medium", colorClass)}
              >
                {row.original.status}
              </Badge>
              <Select
                value={row.original.status}
                onValueChange={(status) =>
                  patchStatusMut.mutate({
                    id: row.original.id,
                    status: status as
                      | "PENDING"
                      | "PAID"
                      | "FAILED"
                      | "REFUNDED",
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
          );
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="size-8"
              >
                <MoreHorizontalIcon className="size-4" />
                <span className="sr-only">Open actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={() => openPublicCampaign(row.original.campaignSlug)}
              >
                Open campaign page
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => void copyText(row.original.id, "Pledge id")}
              >
                Copy pledge id
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  void copyText(row.original.backerEmail, "Investor email")
                }
              >
                Copy investor email
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  void copyText(row.original.campaignId, "Campaign id")
                }
              >
                Copy campaign id
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [patchStatusMut],
  );

  return <AdminDataTable columns={columns} data={data} />;
}
