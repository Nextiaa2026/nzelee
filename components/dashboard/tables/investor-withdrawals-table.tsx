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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCentsToUsd } from "@/lib/money";
import type { UserWithdrawalRow } from "@/lib/services/user-withdrawals";

const dateFmt = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "2-digit",
});

function formatDate(value: Date | string | null | undefined) {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return dateFmt.format(d);
}

const columns: ColumnDef<UserWithdrawalRow, unknown>[] = [
  {
    accessorKey: "requestedAt",
    header: "Requested",
    cell: ({ row }) => formatDate(row.original.requestedAt),
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
      <Badge variant="secondary" className="font-normal">
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "destination",
    header: "Destination",
    cell: ({ row }) => (
      <span className="line-clamp-2 max-w-[240px] text-muted-foreground">
        {row.original.destination}
      </span>
    ),
  },
  {
    accessorKey: "completedAt",
    header: "Completed",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{formatDate(row.original.completedAt)}</span>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" size="icon" variant="ghost" className="size-8">
            <MoreHorizontalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={async () => {
              await navigator.clipboard.writeText(row.original.id);
              toast.success("Withdrawal id copied");
            }}
          >
            Copy request id
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export function InvestorWithdrawalsTable({ data }: { data: UserWithdrawalRow[] }) {
  return <AdminDataTable columns={columns} data={data} enableRowSelection={false} />;
}
