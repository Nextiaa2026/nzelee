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
        "inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.02] px-3 py-1.5 text-xs font-medium tabular-nums text-foreground transition-colors hover:border-mint/30 hover:bg-mint/10 sm:text-sm",
        isError && "opacity-70",
      )}
    >
      <Wallet className="size-3.5 shrink-0 text-mint-foreground" aria-hidden />
      <span className="hidden text-black/50 sm:inline">Wallet</span>
      <span className="font-semibold text-foreground">{formatted}</span>
    </Link>
  );
}
