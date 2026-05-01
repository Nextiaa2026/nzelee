"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";
import { toast } from "sonner";

import { AdminDataTable } from "@/components/admin-data-table";
import { CampaignCard } from "@/components/campaigns/campaign-card";
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
  if (!data.length) {
    return (
      <div className="rounded-lg border border-black/10 bg-white p-6 text-sm text-black/60">
        No investments yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2 md:hidden">
        {data.map((row) => (
          <div key={row.id} className="relative">
            <CampaignCard
              id={row.campaignId}
              title={row.campaignTitle}
              slug={row.campaignSlug}
              summary={`Your investment on ${new Date(row.createdAt).toLocaleDateString()}`}
              coverImageUrl={null}
              raisedAmount={row.amount}
              goalAmount={row.amount}
              currency={row.currency}
              status={row.status}
            />
            <Badge
              variant="outline"
              className="pointer-events-none absolute left-4 top-4 z-10 border-white/70 bg-white/90 font-normal"
            >
              {row.status}
            </Badge>
          </div>
        ))}
      </div>
      <div className="hidden md:block">
        <AdminDataTable columns={columns} data={data} enableRowSelection={false} />
      </div>
    </div>
  );
}
