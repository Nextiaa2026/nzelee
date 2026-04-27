"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { AdminDataTable } from "@/components/admin-data-table";
import { Badge } from "@/components/ui/badge";
import type { InvestorTransactionRow } from "@/lib/mocks";

const columns: ColumnDef<InvestorTransactionRow, unknown>[] = [
  {
    accessorKey: "date",
    header: "Date",
  },
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
  },
  {
    accessorKey: "listing",
    header: "Listing",
  },
];

export function InvestorTransactionsTable({
  data,
}: {
  data: InvestorTransactionRow[];
}) {
  return (
    <AdminDataTable columns={columns} data={data} enableRowSelection={false} />
  );
}
