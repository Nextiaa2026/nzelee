"use client";

import Link from "next/link";
import { ArrowDownToLine, Info } from "lucide-react";

import { DashboardPageShell } from "@/components/dashboard/dashboard-page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserWallet } from "@/hooks/use-user-wallet";
import { cn } from "@/lib/utils";

function formatMoney(cents: number, currency: string) {
  return (cents / 100).toLocaleString(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  });
}

export default function DashboardWalletPage() {
  const { data, isPending, isError, refetch } = useUserWallet();

  return (
    <DashboardPageShell
      eyebrow="Trésorerie"
      title="Portefeuille"
      description="Fonds disponibles provenant des paiements, remboursements et ajustements de plateforme. Les promesses d'investissement sont séparées de ce solde jusqu'à ce qu'elles soient réglées comme crédits ici."
      actions={
        <Button asChild variant="default" className="bg-mint text-mint-foreground hover:bg-mint/90">
          <Link href="/dashboard/withdrawals" className="inline-flex items-center gap-2">
            <ArrowDownToLine className="size-4" aria-hidden />
            Retrait
          </Link>
        </Button>
      }
    >
      {isError ? (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-base">Impossible de charger le portefeuille</CardTitle>
            <CardDescription>Vérifiez votre connexion et réessayez.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button type="button" variant="outline" size="sm" onClick={() => void refetch()}>
              Réessayer
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/80">
          <CardHeader>
            <CardDescription>Disponible</CardDescription>
            <CardTitle className="font-display text-3xl tabular-nums md:text-4xl">
              {isPending || !data ? "…" : formatMoney(data.availableCents, data.currency)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-foreground/60 font-medium">
            Solde dépensable après les retraits terminés. Les demandes de retrait en attente ne réduisent pas
            ce chiffre tant qu&apos;elles ne sont pas traitées.
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 lg:gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Retraits en attente</CardDescription>
              <CardTitle className="font-display text-xl tabular-nums">
                {isPending || !data ? "…" : formatMoney(data.pendingWithdrawalCents, data.currency)}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Crédits cumulés</CardDescription>
              <CardTitle className="font-display text-xl tabular-nums">
                {isPending || !data ? "…" : formatMoney(data.lifetimeCreditsCents, data.currency)}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-xs text-foreground/60 font-medium">
              Paiements réussis, remboursements et ajustements crédités sur votre compte.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Retiré (terminé)</CardDescription>
              <CardTitle className="font-display text-xl tabular-nums">
                {isPending || !data ? "…" : formatMoney(data.lifetimeWithdrawnCents, data.currency)}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>

      <Card className="border-dashed border-border/80 bg-muted/20">
        <CardHeader className="flex flex-row items-start gap-3 space-y-0">
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-xl bg-background ring-1 ring-border",
            )}
          >
            <Info className="size-4 text-foreground/60" aria-hidden />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-base">Ajouter des fonds</CardTitle>
            <CardDescription>
              Les recharges bancaires et par carte ne sont pas activées dans cette démo. En production, connectez une
              source de financement ou recevez des paiements de créateur et des remboursements dans ce portefeuille.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Button type="button" variant="secondary" size="sm" disabled>
            Ajouter des fonds (bientôt)
          </Button>
        </CardContent>
      </Card>
    </DashboardPageShell>
  );
}
