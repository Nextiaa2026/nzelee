"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { InferSelectModel } from "drizzle-orm";

import { AdminDataTable } from "@/components/admin-data-table";
import { Badge } from "@/components/ui/badge";
import { formatCentsToUsd } from "@/lib/money";
import type { paymentTransactions } from "@/lib/db/schema";

type AdminTransactionRow = InferSelectModel<typeof paymentTransactions>;

const columns: ColumnDef<AdminTransactionRow, unknown>[] = [
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
    accessorKey: "campaignId",
    header: "Campaign Id",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">{row.original.campaignId}</span>
    ),
  },
  {
    accessorKey: "provider",
    header: "Provider",
  },
];

export function AdminTransactionsTable({ data }: { data: AdminTransactionRow[] }) {
  return <AdminDataTable columns={columns} data={data} />;
}
