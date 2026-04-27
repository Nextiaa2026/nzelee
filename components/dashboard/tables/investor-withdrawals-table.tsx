"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { AdminDataTable } from "@/components/admin-data-table";
import { Badge } from "@/components/ui/badge";
import type { InvestorWithdrawalRow } from "@/lib/mocks";

const columns: ColumnDef<InvestorWithdrawalRow, unknown>[] = [
  {
    accessorKey: "requestedAt",
    header: "Requested",
  },
  {
    accessorKey: "amount",
    header: "Amount",
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
  },
  {
    accessorKey: "completedAt",
    header: "Completed",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.completedAt}</span>
    ),
  },
];

export function InvestorWithdrawalsTable({
  data,
}: {
  data: InvestorWithdrawalRow[];
}) {
  return (
    <AdminDataTable columns={columns} data={data} enableRowSelection={false} />
  );
}
