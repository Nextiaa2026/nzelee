"use client";

import { motion } from "framer-motion";
import {
  Bell,
  ChevronRight,
  History,
  Mail,
  PencilLine,
  Phone,
  Plus,
  Shield,
  TrendingUp,
  Wallet,
} from "lucide-react";

import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ProfileDashboardViewProps = {
  user: {
    name: string;
    email: string;
    image: string | null;
    phone?: string;
  };
  summary: {
    campaigns: number;
    investments: number;
    investedAmount: number;
  };
  wallet: {
    currency: string;
    availableCents: number;
  };
  transactions: Array<{
    id: string;
    amount: number;
    status: string;
    createdAt: Date;
    type?: string;
  }>;
};

export function ProfileDashboardView({
  user,
  summary,
  wallet,
  transactions,
}: ProfileDashboardViewProps) {
  const formatCurrency = (amountCents: number) => {
    return (amountCents / 100).toLocaleString("en-US", {
      style: "currency",
      currency: wallet.currency || "USD",
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 md:px-6">
      {/* Top Section: Profile & Balance */}
      <div className="grid gap-6 md:grid-cols-5">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-3"
        >
          <div className="neumorph relative flex h-full flex-col items-start justify-between gap-6 overflow-hidden p-8 md:flex-row md:items-center">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-mint/20">
                  <AvatarImage src={user.image ?? ""} alt={user.name} />
                  <AvatarFallback className="bg-mint/10 text-2xl font-bold text-deep-green">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 rounded-full bg-deep-green p-1.5 text-deep-green-foreground shadow-lg ring-2 ring-surface hover:bg-mint transition-colors">
                  <PencilLine className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-1">
                <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
                  {user.name}
                </h1>
                <div className="flex flex-col gap-1 text-sm text-foreground/60">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" />
                    <span>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Button className="rounded-full bg-deep-green px-6 font-semibold text-deep-green-foreground hover:bg-deep-green/90">
              Edit Profile
            </Button>
          </div>
        </motion.div>

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2"
        >
          <div className="relative h-full overflow-hidden rounded-2xl bg-deep-green p-6 text-deep-green-foreground shadow-xl md:p-8">
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-mint" />
                <p className="text-xs font-bold uppercase tracking-widest text-deep-green-foreground/60">
                  Current Balance
                </p>
              </div>
              <p className="font-display text-4xl font-bold tracking-tight">
                {formatCurrency(wallet.availableCents)}
              </p>

              <div className="grid grid-cols-2 gap-4 border-t border-deep-green-foreground/10 pt-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-deep-green-foreground/50">
                    Total Invested
                  </p>
                  <p className="mt-1 font-semibold">
                    {formatCurrency(summary.investedAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-deep-green-foreground/50">
                    Projects
                  </p>
                  <p className="mt-1 font-semibold">{summary.investments}</p>
                </div>
              </div>

              <Button className="w-full rounded-full bg-mint py-6 font-bold text-deep-green hover:bg-mint/90">
                <Plus className="mr-2 h-5 w-5 stroke-[3]" />
                Add Funds
              </Button>
            </div>
            {/* Subtle patterns */}
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-mint/10 blur-3xl" />
            <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-mint/10 blur-3xl" />
          </div>
        </motion.div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="neumorph-pop p-6"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mint/10 text-mint">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-foreground/50">
                Active Campaigns
              </p>
              <p className="font-display text-2xl font-bold">
                {summary.campaigns}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="neumorph-pop p-6"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mint/10 text-mint">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-foreground/50">
                Total Investments
              </p>
              <p className="font-display text-2xl font-bold">
                {summary.investments}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="neumorph-pop p-6"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mint/10 text-mint">
              <History className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-foreground/50">
                Transactions
              </p>
              <p className="font-display text-2xl font-bold">
                {transactions.length}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Middle Section: Security & Notifications */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Security Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="neumorph space-y-6 p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint/10 text-mint">
                <Shield className="h-5 w-5" />
              </div>
              <h2 className="font-display text-xl font-bold">Security</h2>
            </div>

            <div className="space-y-4">
              <button className="flex w-full items-center justify-between rounded-2xl bg-surface-muted p-4 text-left transition-colors hover:bg-surface-muted/80">
                <div className="space-y-1">
                  <p className="text-sm font-semibold">Password</p>
                  <p className="text-xs text-foreground/40">
                    Last changed 3 months ago
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-foreground/30" />
              </button>

              <div className="flex items-center justify-between rounded-2xl bg-surface-muted p-4">
                <div className="space-y-1">
                  <p className="text-sm font-semibold">
                    Two-Factor Authentication
                  </p>
                  <p className="text-xs text-foreground/40">
                    Protect your account with SMS code
                  </p>
                </div>
                <div className="h-6 w-11 rounded-full bg-mint p-1 flex items-center justify-end">
                  <div className="h-4 w-4 rounded-full bg-white shadow-sm" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notifications Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="neumorph space-y-6 p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint/10 text-mint">
                <Bell className="h-5 w-5" />
              </div>
              <h2 className="font-display text-xl font-bold">Notifications</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-2xl p-2">
                <div className="space-y-1">
                  <p className="text-sm font-semibold">New Projects</p>
                  <p className="text-xs text-foreground/40">
                    Get notified when opportunities arise
                  </p>
                </div>
                <div className="h-6 w-11 rounded-full bg-mint p-1 flex items-center justify-end">
                  <div className="h-4 w-4 rounded-full bg-white shadow-sm" />
                </div>
              </div>
              <div className="h-px bg-foreground/5" />
              <div className="flex items-center justify-between rounded-2xl p-2">
                <div className="space-y-1">
                  <p className="text-sm font-semibold">Investment Updates</p>
                  <p className="text-xs text-foreground/40">
                    Monthly reports and project news
                  </p>
                </div>
                <div className="h-6 w-11 rounded-full bg-mint p-1 flex items-center justify-end">
                  <div className="h-4 w-4 rounded-full bg-white shadow-sm" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Section: Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="neumorph space-y-6 overflow-hidden p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint/10 text-mint">
                <History className="h-5 w-5" />
              </div>
              <h2 className="font-display text-xl font-bold">
                Transaction History
              </h2>
            </div>
            <Link
              href="/dashboard/transactions"
              className="text-sm font-semibold text-mint hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="rounded-2xl border border-foreground/5 overflow-hidden">
            <Table>
              <TableHeader className="bg-surface-muted">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-bold text-foreground/60">
                    Date
                  </TableHead>
                  <TableHead className="font-bold text-foreground/60">
                    Transaction
                  </TableHead>
                  <TableHead className="font-bold text-foreground/60">
                    Category
                  </TableHead>
                  <TableHead className="font-bold text-foreground/60">
                    Amount
                  </TableHead>
                  <TableHead className="font-bold text-foreground/60 text-right">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <TableRow
                      key={tx.id}
                      className="border-foreground/5 hover:bg-surface-muted/50"
                    >
                      <TableCell className="font-medium text-foreground/80">
                        {tx.createdAt.toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="font-semibold">
                        Investment - {tx.id.slice(0, 8)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="rounded-md bg-mint/10 text-mint hover:bg-mint/20 border-0"
                        >
                          Campaign
                        </Badge>
                      </TableCell>
                      <TableCell
                        className={cn(
                          "font-bold",
                          tx.amount < 0 ? "text-red-500" : "text-emerald-500",
                        )}
                      >
                        {tx.amount < 0 ? "-" : "+"}{" "}
                        {formatCurrency(Math.abs(tx.amount))}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span className="text-sm font-semibold text-emerald-600">
                            Completed
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-12 text-center text-foreground/40"
                    >
                      No transactions yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
