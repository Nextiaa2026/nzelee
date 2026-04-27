"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { AdminDataTable } from "@/components/admin-data-table";
import { Badge } from "@/components/ui/badge";
import type { InvestorInvestmentRow } from "@/lib/mocks";

const columns: ColumnDef<InvestorInvestmentRow, unknown>[] = [
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "listing",
    header: "Listing",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className="font-normal">
        {row.original.status}
      </Badge>
    ),
  },
];

export function InvestorInvestmentsTable({
  data,
}: {
  data: InvestorInvestmentRow[];
}) {
  return (
    <AdminDataTable columns={columns} data={data} enableRowSelection={false} />
  );
}
