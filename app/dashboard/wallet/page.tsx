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
      eyebrow="Treasury"
      title="Wallet"
      description="Funds available from payouts, refunds, and platform adjustments. Investment pledges are separate from this balance until they settle as credits here."
      actions={
        <Button asChild variant="default" className="bg-mint text-mint-foreground hover:bg-mint/90">
          <Link href="/dashboard/withdrawals" className="inline-flex items-center gap-2">
            <ArrowDownToLine className="size-4" aria-hidden />
            Withdraw
          </Link>
        </Button>
      }
    >
      {isError ? (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-base">Could not load wallet</CardTitle>
            <CardDescription>Check your connection and try again.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button type="button" variant="outline" size="sm" onClick={() => void refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/80">
          <CardHeader>
            <CardDescription>Available</CardDescription>
            <CardTitle className="font-display text-3xl tabular-nums md:text-4xl">
              {isPending || !data ? "…" : formatMoney(data.availableCents, data.currency)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Spendable balance after completed withdrawals. Pending withdrawal requests do not reduce
            this figure until they are processed.
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 lg:gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending withdrawals</CardDescription>
              <CardTitle className="font-display text-xl tabular-nums">
                {isPending || !data ? "…" : formatMoney(data.pendingWithdrawalCents, data.currency)}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Lifetime credits</CardDescription>
              <CardTitle className="font-display text-xl tabular-nums">
                {isPending || !data ? "…" : formatMoney(data.lifetimeCreditsCents, data.currency)}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-xs text-muted-foreground">
              Succeeded payouts, refunds, and adjustments credited to you.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Withdrawn (completed)</CardDescription>
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
            <Info className="size-4 text-muted-foreground" aria-hidden />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-base">Add funds</CardTitle>
            <CardDescription>
              Bank top-ups and card loads are not enabled in this demo. In production, connect a
              funding source or receive creator payouts and refunds into this wallet.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Button type="button" variant="secondary" size="sm" disabled>
            Add funds (soon)
          </Button>
        </CardContent>
      </Card>
    </DashboardPageShell>
  );
}
