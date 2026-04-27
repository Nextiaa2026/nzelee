"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { AdminDataTable } from "@/components/admin-data-table";
import { Badge } from "@/components/ui/badge";
import type { AdminPledgeRow } from "@/lib/mocks";

const columns: ColumnDef<AdminPledgeRow, unknown>[] = [
  {
    accessorKey: "campaign",
    header: "Campaign",
  },
  {
    accessorKey: "backer",
    header: "Backer",
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

export function AdminPledgesTable({ data }: { data: AdminPledgeRow[] }) {
  return <AdminDataTable columns={columns} data={data} />;
}
