"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useMemo, useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { isApiSuccess } from "@/lib/http/api-result";
import type { UserInvestmentListRow } from "@/lib/services/user-investments";
import {
  buildInvestmentCheckoutCallbackUrl,
  startInvestmentRepayCheckout,
} from "@/lib/services/user-investments";

function formatMoney(storedMinor: number, currency: string) {
  const upper = currency.toUpperCase();
  const divisor = upper === "XAF" || upper === "JPY" ? 1 : 100;
  const major = storedMinor / divisor;
  return major.toLocaleString("fr-FR", {
    style: "currency",
    currency: upper,
  });
}

function pledgeStatusLabel(status: string) {
  const map: Record<string, string> = {
    PENDING: "En attente",
    PAID: "Payé",
    FAILED: "Échoué",
    REFUNDED: "Remboursé",
  };
  return map[status] ?? status;
}

function paymentStatusLabel(status: string | null) {
  if (!status) return "—";
  const map: Record<string, string> = {
    PENDING: "En attente",
    PROCESSING: "En cours",
    SUCCEEDED: "Confirmé",
    FAILED: "Échoué",
    CANCELED: "Annulé",
    REVERSED: "Annulé",
  };
  return map[status] ?? status;
}

export function InvestorInvestmentsTable({
  data,
}: {
  data: UserInvestmentListRow[];
}) {
  const [sheetRow, setSheetRow] = useState<UserInvestmentListRow | null>(null);
  const [repayBusyId, setRepayBusyId] = useState<string | null>(null);

  const openRepay = async (row: UserInvestmentListRow) => {
    setRepayBusyId(row.id);
    try {
      const r = await startInvestmentRepayCheckout(
        row.id,
        buildInvestmentCheckoutCallbackUrl(),
      );
      if (!isApiSuccess(r)) {
        toast.error(r.error?.message ?? "Could not start payment.");
        return;
      }
      const url = r.data.notch?.authorizationUrl;
      if (url) {
        toast.message("Redirecting to Notch Pay…");
        window.location.assign(url);
      } else {
        toast.error("No checkout URL returned.");
      }
    } finally {
      setRepayBusyId(null);
    }
  };

  const columns = useMemo<ColumnDef<UserInvestmentListRow, unknown>[]>(
    () => [
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
          formatMoney(row.original.amount, row.original.currency),
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
        accessorKey: "paymentStatus",
        header: "Payment",
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">
            {row.original.paymentStatus ?? "—"}
          </span>
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
              <DropdownMenuItem onClick={() => setSheetRow(row.original)}>
                View details
              </DropdownMenuItem>
              {row.original.canOpenCheckout ? (
                <DropdownMenuItem
                  disabled={repayBusyId === row.original.id}
                  onClick={() => void openRepay(row.original)}
                >
                  {repayBusyId === row.original.id ? "Opening…" : "Pay / retry"}
                </DropdownMenuItem>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [repayBusyId],
  );

  if (!data.length) {
    return (
      <div className="rounded-lg border border-black/10 bg-white p-6 text-sm text-black/60">
        No investments yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Sheet
        open={sheetRow !== null}
        onOpenChange={(open) => {
          if (!open) setSheetRow(null);
        }}
      >
        <SheetContent
          className="flex h-full w-full max-h-dvh flex-col gap-0 p-0 sm:max-w-md"
          side="right"
        >
          {sheetRow ? (
            <>
              <SheetHeader className="space-y-1 border-b border-border px-4 pb-4 pr-14 pt-1 text-left">
                <SheetTitle className="font-display text-lg font-semibold tracking-tight text-deep-green">
                  Détail de l&apos;investissement
                </SheetTitle>
                <SheetDescription className="text-pretty text-sm leading-relaxed">
                  Campagne, montant et statut du paiement sécurisé (Notch Pay).
                </SheetDescription>
              </SheetHeader>

              <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-4 py-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    Campagne
                  </p>
                  <Link
                    href={`/campaigns/${sheetRow.campaignSlug}`}
                    className="mt-2 block text-base font-semibold leading-snug text-foreground underline-offset-4 hover:text-deep-green hover:underline"
                  >
                    {sheetRow.campaignTitle}
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Voir la page publique du projet
                  </p>
                </div>

                <Separator />

                <div className="rounded-lg border border-border/80 bg-muted/30 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    Montant engagé
                  </p>
                  <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-deep-green">
                    {formatMoney(sheetRow.amount, sheetRow.currency)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                      Engagement
                    </p>
                    <Badge
                      variant="outline"
                      className="w-fit border-deep-green/25 bg-white font-medium text-deep-green"
                    >
                      {pledgeStatusLabel(sheetRow.status)}
                    </Badge>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                      Paiement
                    </p>
                    <Badge
                      variant="outline"
                      className="w-fit font-medium text-foreground"
                    >
                      {paymentStatusLabel(sheetRow.paymentStatus)}
                    </Badge>
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                      Date de création
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(sheetRow.createdAt).toLocaleString("fr-FR", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <SheetFooter className="mt-0 shrink-0 flex-col gap-2 border-t border-border bg-muted/25 px-4 py-4 sm:flex-col">
                {sheetRow.canOpenCheckout ? (
                  <>
                    <Button
                      type="button"
                      size="lg"
                      className="w-full rounded-md bg-deep-green font-semibold text-white hover:bg-deep-green/90"
                      disabled={repayBusyId === sheetRow.id}
                      onClick={() => void openRepay(sheetRow)}
                    >
                      {repayBusyId === sheetRow.id
                        ? "Ouverture de Notch Pay…"
                        : sheetRow.paymentStatus === "FAILED" ||
                            sheetRow.paymentStatus === "CANCELED" ||
                            sheetRow.status === "FAILED"
                          ? "Réessayer le paiement"
                          : "Payer avec Notch Pay"}
                    </Button>
                    <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
                      Vous serez redirigé vers la page sécurisée Notch Pay pour finaliser
                      ou compléter le paiement.
                    </p>
                  </>
                ) : sheetRow.status === "PAID" ||
                  sheetRow.paymentStatus === "SUCCEEDED" ? (
                  <p className="rounded-md border border-emerald-500/25 bg-emerald-500/10 px-3 py-2.5 text-center text-sm text-emerald-900 dark:text-emerald-100">
                    Paiement confirmé. Merci pour votre soutien à ce projet.
                  </p>
                ) : (
                  <p className="text-center text-xs leading-relaxed text-muted-foreground">
                    Le paiement en ligne n&apos;est plus disponible pour cet engagement
                    (statut final ou canal non pris en charge).
                  </p>
                )}
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>

      <div className="space-y-2 md:hidden">
        {data.map((row) => (
          <div key={row.id} className="relative space-y-2">
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
            <div className="flex gap-2 px-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setSheetRow(row)}
              >
                Details
              </Button>
              {row.canOpenCheckout ? (
                <Button
                  type="button"
                  size="sm"
                  className="flex-1 bg-mint text-mint-foreground hover:bg-mint/90"
                  disabled={repayBusyId === row.id}
                  onClick={() => void openRepay(row)}
                >
                  Pay
                </Button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      <div className="hidden md:block">
        <AdminDataTable columns={columns} data={data} enableRowSelection={false} />
      </div>
    </div>
  );
}
