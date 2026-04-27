"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { AdminDataTable } from "@/components/admin-data-table";
import { Badge } from "@/components/ui/badge";
import type { AdminCampaignRow } from "@/lib/mocks";

const columns: ColumnDef<AdminCampaignRow, unknown>[] = [
  {
    accessorKey: "title",
    header: "Campaign",
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {row.original.slug}
      </span>
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
    accessorKey: "goal",
    header: "Goal",
  },
  {
    accessorKey: "raised",
    header: "Raised",
  },
];

export function AdminCampaignsTable({ data }: { data: AdminCampaignRow[] }) {
  return <AdminDataTable columns={columns} data={data} />;
}
