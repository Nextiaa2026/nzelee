"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";
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
    header: "Statut",
    cell: ({ row }) => (
      <Badge variant="secondary" className="font-normal">
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "amount",
    header: "Montant",
  },
  {
    accessorKey: "listing",
    header: "Annonce",
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
            onClick={() => toast.info(`Transaction ${row.original.id}`)}
          >
            Voir détails
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export function InvestorTransactionsTable({
  data,
  page,
  pageSize,
  total,
  onPageChange,
}: {
  data: InvestorTransactionRow[];
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  if (!data.length) {
    return (
      <div className="rounded-lg border border-black/10 bg-white p-6 text-sm text-black/60">
        Aucune transaction pour le moment.
      </div>
    );
  }

  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, pageCount);

  return (
    <div className="space-y-3">
      <div className="space-y-2 md:hidden">
        {data.map((row) => (
          <div
            key={row.id}
            className="rounded-xl border border-black/10 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-black/90">{row.type}</p>
              <Badge variant="secondary" className="font-normal">
                {row.status}
              </Badge>
            </div>
            <p className="mt-2 text-xs text-black/50">{row.date}</p>
            <p className="mt-2 text-sm font-semibold text-black/85">
              {row.amount}
            </p>
            <p className="mt-1 text-xs text-black/60">{row.listing}</p>
          </div>
        ))}
      </div>
      <div className="hidden md:block">
        <AdminDataTable columns={columns} data={data} enableRowSelection={false} />
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8"
          aria-label="Previous page"
          disabled={safePage <= 1}
          onClick={() => onPageChange(Math.max(1, safePage - 1))}
        >
          <ChevronLeftIcon className="size-4" />
        </Button>
        <p className="text-xs text-black/60">
          Page {safePage} sur {pageCount}
        </p>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8"
          aria-label="Next page"
          disabled={safePage >= pageCount}
          onClick={() => onPageChange(Math.min(pageCount, safePage + 1))}
        >
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}
