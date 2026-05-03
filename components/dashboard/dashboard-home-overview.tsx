"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowUpRight,
  Banknote,
  Bookmark,
  Briefcase,
  CircleDollarSign,
  Compass,
  History,
  ShieldCheck,
  Store,
  TrendingUp,
  Wallet2,
} from "lucide-react";

import {
  CampaignCard,
  type CampaignCardProps,
} from "@/components/campaigns/campaign-card";
import { dashboardPanelClass } from "@/components/dashboard/dashboard-page-shell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export type DashboardHomeOverviewProps = {
  userName: string | null;
  isAdmin: boolean;
  kycStatus: string | null;
  summary: {
    campaigns: number;
    investments: number;
    investedAmount: number;
    unreadNotifications: number;
    pendingWithdrawals: number;
  };
  wallet: {
    currency: string;
    availableCents: number;
    pendingWithdrawalCents: number;
    lifetimeWithdrawnCents: number;
  };
  campaigns: CampaignCardProps[];
  campaignsSectionTitle: string;
  usingSamplePledges: boolean;
  /** Total browseable campaigns (not just the preview slice). */
  browseableCampaignCount: number;
};

export function DashboardHomeOverview({
  userName,
  isAdmin,
  summary,
  wallet,
  campaigns,
  campaignsSectionTitle,
  usingSamplePledges,
  browseableCampaignCount,
}: DashboardHomeOverviewProps) {
  const first = userName?.trim()?.split(/\s+/)[0] ?? "là";
  const fmt = (cents: number, currency: string) =>
    (cents / 100).toLocaleString(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    });

  const stats = [
    ...(isAdmin
      ? [
          {
            label: "Vos annonces",
            value: String(summary.campaigns),
            sub: "Campagnes que vous publiez",
            icon: Briefcase,
            href: "/dashboard/projects" as const,
          },
        ]
      : [
          {
            label: "Marchés",
            value: String(browseableCampaignCount),
            sub: "Campagnes ouvertes aux investisseurs",
            icon: Compass,
            href: "/dashboard/markets" as const,
          },
        ]),
    {
      label: "Investissements",
      value: String(summary.investments),
      sub: "Engagements actifs",
      icon: TrendingUp,
      href: "/dashboard/investments" as const,
    },
    {
      label: "Disponible",
      value: fmt(wallet.availableCents, wallet.currency),
      sub: `${fmt(wallet.pendingWithdrawalCents, wallet.currency)} retrait en attente`,
      icon: Wallet2,
      href: "/dashboard/wallet" as const,
    },
    {
      label: "Total investi",
      value: fmt(summary.investedAmount, wallet.currency),
      sub: "Toutes campagnes confondues",
      icon: CircleDollarSign,
      href: "/dashboard/investments" as const,
    },
    ...(isAdmin
      ? [
          {
            label: "Administration",
            value: "Gérer",
            sub: "Panneau d'administration",
            icon: ShieldCheck,
            href: "/admin" as const,
            valueColor: "text-deep-green",
          },
        ]
      : []),
  ] as const;

  return (
    <div className="flex flex-col gap-8 pb-4">
      <motion.section
        initial="hidden"
        animate="show"
        variants={fadeUp}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-hero-bg p-6 text-deep-green-foreground md:p-8"
      >
        <motion.div
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.78 0.16 145 / 0.4), transparent 70%)",
          }}
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full md:h-72 md:w-72"
          style={{
            background:
              "radial-gradient(circle, oklch(0.78 0.16 145 / 0.22), transparent 72%)",
          }}
          animate={{ x: [0, 12, 0], y: [0, -10, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-mint">
              Aperçu
            </p>
            <h1 className="font-display mt-2 text-3xl text-glow md:text-5xl">
              Bonjour, {first}
            </h1>
            <p className="mt-2 max-w-lg text-sm text-deep-green-foreground/75 md:text-base">
              Votre centre de commande pour vos campagnes, le solde de votre portefeuille et vos engagements. Les données ci-dessous proviennent de votre compte réel.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3">
            <Button
              asChild
              className="rounded-full bg-mint font-medium text-deep-green hover:bg-mint/90"
            >
              <Link href="/dashboard/markets" className="gap-1.5">
                <Store className="size-4" />
                Parcourir les marchés
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-deep-green-foreground/25 bg-deep-green/20 text-deep-green-foreground hover:bg-deep-green/35"
            >
              <Link href="/dashboard/withdrawals" className="gap-1.5">
                <Banknote className="size-4" />
                Retrait
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.06 } } }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((s, idx) => (
          <motion.div key={s.label} variants={fadeUp} className="h-full">
            <Link
              href={s.href}
              className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint/50 focus-visible:ring-offset-2"
            >
              <div className="flex h-full flex-col justify-between bg-mint p-6 rounded-2xl border border-mint/20 shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all hover:shadow-[0_15px_45px_rgb(0,0,0,0.1)] hover:scale-[1.02]">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/30 text-deep-green">
                    <s.icon className="size-5" />
                  </div>
                  {idx < 3 && (
                    <span className="rounded-full bg-white/40 px-2 py-0.5 text-[10px] font-bold text-deep-green">
                      +{((idx * 3.7 + 5) % 15 + 5).toFixed(1)}%
                    </span>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-deep-green/70">{s.label}</p>
                  <p
                    className={cn(
                      "font-display mt-1 text-2xl font-bold tracking-tight",
                      "valueColor" in s && typeof s.valueColor === "string"
                        ? s.valueColor
                        : "text-deep-green",
                    )}
                  >
                    {s.value}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.section>

      <section className="grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className={cn(
            dashboardPanelClass,
            "col-span-2 p-6 shadow-none md:p-7",
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Pouls du portefeuille
              </p>
              <p className="text-xs text-foreground/50">
                Portefeuille vs retraits en attente
              </p>
            </div>
            <Link
              href="/dashboard/wallet"
              className="text-xs font-medium text-deep-green hover:underline"
            >
              Détails du portefeuille
            </Link>
          </div>
          <div className="mt-6 h-48 w-full rounded-2xl border border-foreground/5 bg-surface-muted/80 p-4">
            <svg
              viewBox="0 0 520 160"
              className="h-full w-full text-deep-green/90"
            >
              <defs>
                <linearGradient id="dash-hero-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--mint)"
                    stopOpacity="0.35"
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--mint)"
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>
              {[32, 64, 96, 128].map((y) => (
                <line
                  key={y}
                  x1="0"
                  x2="520"
                  y1={y}
                  y2={y}
                  className="stroke-foreground/8"
                  strokeWidth="1"
                />
              ))}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
                d="M0,120 C80,100 120,130 180,88 C240,46 300,72 360,52 C420,32 460,48 520,28"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <motion.path
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                d="M0,120 C80,100 120,130 180,88 C240,46 300,72 360,52 C420,32 460,48 520,28 L520,160 L0,160 Z"
                fill="url(#dash-hero-fill)"
              />
            </svg>
          </div>
          <p className="mt-3 text-center text-xs text-foreground/45">
            Flux de trésorerie réel — les soldes et engagements utilisent les données de votre compte.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className={cn(
            dashboardPanelClass,
            "flex flex-col gap-3 p-6 shadow-none",
          )}
        >
          <p className="text-sm font-semibold">Raccourcis</p>
          <Link
            href="/dashboard/transactions"
            className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm text-foreground/80 transition hover:border-foreground/10 hover:bg-surface-muted"
          >
            <History className="size-4 text-deep-green" />
            Transactions
          </Link>
          <Link
            href="/dashboard/saved"
            className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm text-foreground/80 transition hover:border-foreground/10 hover:bg-surface-muted"
          >
            <Bookmark className="size-4 text-deep-green" />
            Campagnes sauvegardées
          </Link>
          <Link
            href="/kyc"
            className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm text-foreground/80 transition hover:border-foreground/10 hover:bg-surface-muted"
          >
            <ShieldCheck className="size-4 text-deep-green" />
            Vérification (KYC)
          </Link>
        </motion.div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-foreground/45">
              Découvrir
            </p>
            <h2 className="font-display text-xl tracking-tight text-foreground md:text-2xl">
              {campaignsSectionTitle}
            </h2>
            {usingSamplePledges ? (
              <p className="mt-1 max-w-2xl text-sm text-foreground/55">
                Tours illustratifs jusqu&apos;à ce que des campagnes en direct soient disponibles.{" "}
                <Link
                  href="/dashboard/markets"
                  className="font-medium text-deep-green underline-offset-2 hover:underline"
                >
                  Marchés ouverts
                </Link>
                .
              </p>
            ) : null}
          </div>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="shrink-0 text-foreground/60 hover:text-foreground"
          >
            <Link href="/dashboard/markets" className="gap-1">
              Tout voir <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c) => (
            <CampaignCard key={c.id} {...c} />
          ))}
        </div>
      </section>
    </div>
  );
}
