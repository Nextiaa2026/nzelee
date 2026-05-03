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

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
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
    header: "Demandé",
    cell: ({ row }) => formatDate(row.original.requestedAt),
  },
  {
    accessorKey: "amount",
    header: "Montant",
    cell: ({ row }) => formatCentsToUsd(row.original.amount),
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
    header: "Terminé",
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
              toast.success("ID de retrait copié");
            }}
          >
            Copier l&apos;ID de demande
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export function InvestorWithdrawalsTable({ data }: { data: UserWithdrawalRow[] }) {
  if (!data.length) {
    return (
      <div className="rounded-lg border border-black/10 bg-white p-6 text-sm text-black/60">
        Aucun retrait pour le moment.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2 md:hidden">
        {data.map((row) => (
          <div
            key={row.id}
            className="rounded-xl border border-black/10 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-black/90">
                {formatCentsToUsd(row.amount)}
              </p>
              <Badge variant="secondary" className="font-normal">
                {row.status}
              </Badge>
            </div>
            <p className="mt-2 text-xs text-black/50">
              Demandé le {formatDate(row.requestedAt)}
            </p>
            <p className="mt-1 text-xs text-black/60">{row.destination}</p>
            <p className="mt-1 text-xs text-black/45">
              Terminé le {formatDate(row.completedAt)}
            </p>
          </div>
        ))}
      </div>
      <div className="hidden md:block">
        <AdminDataTable columns={columns} data={data} enableRowSelection={false} />
      </div>
    </div>
  );
}
