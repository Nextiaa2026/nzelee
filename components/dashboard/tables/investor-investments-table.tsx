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
import type { UserInvestmentListRow } from "@/lib/services/user-investments";

const columns: ColumnDef<UserInvestmentListRow, unknown>[] = [
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    accessorKey: "campaignTitle",
    header: "Listing",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) =>
      (row.original.amount / 100).toLocaleString(undefined, {
        style: "currency",
        currency: row.original.currency,
      }),
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
          <DropdownMenuItem onClick={() => toast.info(`Investment ${row.original.id}`)}>
            View details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export function InvestorInvestmentsTable({
  data,
}: {
  data: UserInvestmentListRow[];
}) {
  return (
    <AdminDataTable columns={columns} data={data} enableRowSelection={false} />
  );
}
