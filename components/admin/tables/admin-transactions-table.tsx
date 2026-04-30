"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";
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
import { openPublicCampaign } from "@/lib/admin/open-links";
import { formatCentsToUsd } from "@/lib/money";
import type { AdminTransactionListRow } from "@/types/api/admin";

const copyText = async (value: string, label: string) => {
  await navigator.clipboard.writeText(value);
  toast.success(`${label} copied`);
};

const columns: ColumnDef<AdminTransactionListRow, unknown>[] = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.type}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="secondary" className="font-normal">
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => formatCentsToUsd(row.original.amount),
  },
  {
    accessorKey: "campaignTitle",
    header: "Campaign",
    cell: ({ row }) => (
      <span className="max-w-[200px] truncate text-sm text-foreground">
        {row.original.campaignTitle}
      </span>
    ),
  },
  {
    accessorKey: "campaignId",
    header: "Campaign Id",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {row.original.campaignId}
      </span>
    ),
  },
  {
    accessorKey: "provider",
    header: "Provider",
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" size="icon" variant="ghost" className="size-8">
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
            onClick={() => void copyText(row.original.id, "Transaction id")}
          >
            Copy transaction id
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              void copyText(row.original.campaignId, "Campaign id")
            }
          >
            Copy campaign id
          </DropdownMenuItem>
          {row.original.pledgeId ? (
            <DropdownMenuItem
              onClick={() => void copyText(row.original.pledgeId!, "Pledge id")}
            >
              Copy pledge id
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export function AdminTransactionsTable({
  data,
}: {
  data: AdminTransactionListRow[];
}) {
  return <AdminDataTable columns={columns} data={data} />;
}
