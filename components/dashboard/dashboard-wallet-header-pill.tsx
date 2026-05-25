"use client";

import Link from "next/link";
import { Wallet } from "lucide-react";

import { useUserWallet } from "@/hooks/use-user-wallet";
import { cn } from "@/lib/utils";

export function DashboardWalletHeaderPill() {
  const { data, isPending, isError } = useUserWallet();

  const formatted =
    data != null
      ? (data.availableCents / 100).toLocaleString(undefined, {
          style: "currency",
          currency: data.currency,
        })
      : isPending
        ? "…"
        : "—";

  return (
    <Link
      href="/dashboard/wallet"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-deep-green/15 bg-mint/15 px-3 py-1.5 text-xs font-medium tabular-nums text-deep-green transition-colors hover:border-mint/40 hover:bg-mint/25 sm:text-sm",
        isError && "opacity-70",
      )}
    >
      <Wallet className="size-3.5 shrink-0 text-deep-green" aria-hidden />
      <span className="hidden text-deep-green/60 sm:inline">Portefeuille</span>
      <span className="font-semibold text-deep-green">{formatted}</span>
    </Link>
  );
}
