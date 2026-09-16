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

const tones = {
  mint: {
    card: "bg-mint text-deep-green",
    muted: "text-deep-green/65",
    icon: "bg-deep-green/10 text-deep-green",
    glow: "bg-white/35",
  },
  deep: {
    card: "bg-deep-green text-white",
    muted: "text-white/65",
    icon: "bg-white/10 text-mint",
    glow: "bg-mint/20",
  },
  white: {
    card: "bg-white text-deep-green ring-1 ring-deep-green/10",
    muted: "text-deep-green/55",
    icon: "bg-deep-green/8 text-deep-green",
    glow: "bg-mint/25",
  },
  soft: {
    card: "bg-neutral-100 text-deep-green",
    muted: "text-deep-green/50",
    icon: "bg-white text-deep-green",
    glow: "bg-deep-green/5",
  },
} as const;

type StatTone = keyof typeof tones;

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
  /** Total browseable campaigns (not just the preview slice). */
  browseableCampaignCount: number;
};

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  href,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  icon: typeof Briefcase;
  href: string;
  tone: StatTone;
}) {
  const palette = tones[tone];

  return (
    <Link
      href={href}
      className="block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint/50 focus-visible:ring-offset-2"
    >
      <article
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-2xl p-5 transition duration-300 hover:-translate-y-1 sm:p-6",
          palette.card,
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute -right-8 -top-10 size-32 rounded-full blur-2xl",
            palette.glow,
          )}
        />
        <div className="relative flex items-start justify-between gap-3">
          <p className={cn("text-sm font-medium", palette.muted)}>{label}</p>
          <span
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-2xl",
              palette.icon,
            )}
          >
            <Icon className="size-5" />
          </span>
        </div>
        <p className="font-display relative mt-8 text-3xl font-semibold tracking-tight sm:text-4xl">
          {value}
        </p>
        <p className={cn("relative mt-2 text-xs leading-relaxed", palette.muted)}>
          {hint}
        </p>
      </article>
    </Link>
  );
}

export function DashboardHomeOverview({
  userName,
  isAdmin,
  kycStatus,
  summary,
  wallet,
  campaigns,
  campaignsSectionTitle,
  browseableCampaignCount,
}: DashboardHomeOverviewProps) {
  const first = userName?.trim()?.split(/\s+/)[0] ?? "là";
  const fmt = (cents: number, currency: string) =>
    (cents / 100).toLocaleString(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    });

  const stats: Array<{
    label: string;
    value: string;
    hint: string;
    icon: typeof Briefcase;
    href: string;
    tone: StatTone;
  }> = [
    ...(isAdmin
      ? [
          {
            label: "Vos annonces",
            value: String(summary.campaigns),
            hint:
              summary.campaigns === 1
                ? "1 campagne que vous publiez"
                : `${summary.campaigns} campagnes que vous publiez`,
            icon: Briefcase,
            href: "/dashboard/projects",
            tone: "mint" as const,
          },
        ]
      : [
          {
            label: "Marchés",
            value: String(browseableCampaignCount),
            hint: "Campagnes ouvertes aux investisseurs",
            icon: Compass,
            href: "/dashboard/markets",
            tone: "mint" as const,
          },
        ]),
    {
      label: "Investissements",
      value: String(summary.investments),
      hint:
        summary.pendingWithdrawals > 0
          ? `${summary.pendingWithdrawals} retrait${summary.pendingWithdrawals > 1 ? "s" : ""} en attente`
          : "Engagements sur votre compte",
      icon: TrendingUp,
      href: "/dashboard/investments",
      tone: "deep",
    },
    {
      label: "Disponible",
      value: fmt(wallet.availableCents, wallet.currency),
      hint: `${fmt(wallet.pendingWithdrawalCents, wallet.currency)} en retrait en attente`,
      icon: Wallet2,
      href: "/dashboard/wallet",
      tone: "white",
    },
    {
      label: "Total investi",
      value: fmt(summary.investedAmount, wallet.currency),
      hint: "Somme de vos engagements",
      icon: CircleDollarSign,
      href: "/dashboard/investments",
      tone: "soft",
    },
    ...(isAdmin
      ? [
          {
            label: "Administration",
            value: "Gérer",
            hint: "Panneau d'administration",
            icon: ShieldCheck,
            href: "/admin",
            tone: "deep" as const,
          },
        ]
      : []),
  ];

  const pulseTotal =
    wallet.availableCents + wallet.pendingWithdrawalCents || 1;
  const availablePct = Math.round(
    (wallet.availableCents / pulseTotal) * 100,
  );
  const pendingPct = Math.max(0, 100 - availablePct);
  const kycLabel =
    kycStatus === "APPROVED"
      ? "KYC vérifié"
      : kycStatus === "PENDING" || kycStatus === "UNDER_REVIEW"
        ? "KYC en cours"
        : "Vérification (KYC)";

  return (
    <div className="flex flex-col gap-8 pb-4">
      <motion.section
        initial="hidden"
        animate="show"
        variants={fadeUp}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-[1.75rem] bg-deep-green p-6 text-deep-green-foreground shadow-[0_20px_50px_-28px_rgba(5,45,29,0.45)] md:p-8"
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
            <p className="text-xs font-bold uppercase tracking-widest text-mint">
              Aperçu
            </p>
            <h1 className="font-display mt-2 text-3xl tracking-tight text-white md:text-5xl">
              Bonjour, {first}
            </h1>
            <p className="mt-2 max-w-lg text-sm text-white/75 md:text-base">
              Solde, engagements et campagnes — données en direct de votre
              compte.
              {summary.unreadNotifications > 0
                ? ` ${summary.unreadNotifications} notification${summary.unreadNotifications > 1 ? "s" : ""} non lue${summary.unreadNotifications > 1 ? "s" : ""}.`
                : null}
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
              className="rounded-full border-white/35 bg-white/10 text-white hover:bg-white/20 hover:text-white"
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
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((s) => (
          <motion.div key={s.label} variants={fadeUp} className="h-full">
            <StatCard {...s} />
          </motion.div>
        ))}
      </motion.section>

      <section className="grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className={cn(dashboardPanelClass, "col-span-2 p-6 md:p-7")}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-deep-green">
                Pouls du portefeuille
              </p>
              <p className="text-xs text-deep-green/50">
                Disponible vs retraits en attente
              </p>
            </div>
            <Link
              href="/dashboard/wallet"
              className="text-xs font-medium text-deep-green hover:underline"
            >
              Détails du portefeuille
            </Link>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-medium text-deep-green/60">
                  Disponible
                </span>
                <span className="font-bold tabular-nums text-deep-green">
                  {fmt(wallet.availableCents, wallet.currency)} · {availablePct}
                  %
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-mint transition-[width]"
                  style={{ width: `${availablePct}%` }}
                />
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-medium text-deep-green/60">
                  Retraits en attente
                </span>
                <span className="font-bold tabular-nums text-deep-green">
                  {fmt(wallet.pendingWithdrawalCents, wallet.currency)} ·{" "}
                  {pendingPct}%
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-deep-green/70 transition-[width]"
                  style={{ width: `${pendingPct}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-deep-green/45">
              Retiré à ce jour :{" "}
              <span className="font-semibold text-deep-green/70">
                {fmt(wallet.lifetimeWithdrawnCents, wallet.currency)}
              </span>
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className={cn(dashboardPanelClass, "flex flex-col gap-2 p-6")}
        >
          <p className="mb-1 text-sm font-semibold text-deep-green">
            Raccourcis
          </p>
          <Link
            href="/dashboard/transactions"
            className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-deep-green/80 transition hover:bg-neutral-50"
          >
            <History className="size-4 text-deep-green" />
            Transactions
          </Link>
          <Link
            href="/dashboard/saved"
            className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-deep-green/80 transition hover:bg-neutral-50"
          >
            <Bookmark className="size-4 text-deep-green" />
            Campagnes sauvegardées
          </Link>
          <Link
            href="/dashboard/notifications"
            className="flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-sm text-deep-green/80 transition hover:bg-neutral-50"
          >
            <span className="flex items-center gap-3">
              <ShieldCheck className="size-4 text-deep-green" />
              Notifications
            </span>
            {summary.unreadNotifications > 0 ? (
              <span className="rounded-full bg-mint px-2 py-0.5 text-[10px] font-bold text-deep-green">
                {summary.unreadNotifications}
              </span>
            ) : null}
          </Link>
          <Link
            href="/kyc"
            className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-deep-green/80 transition hover:bg-neutral-50"
          >
            <ShieldCheck className="size-4 text-deep-green" />
            {kycLabel}
          </Link>
        </motion.div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-deep-green/45">
              Découvrir
            </p>
            <h2 className="font-display text-xl tracking-tight text-deep-green md:text-2xl">
              {campaignsSectionTitle}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="shrink-0 text-deep-green/60 hover:text-deep-green"
          >
            <Link href="/dashboard/markets" className="gap-1">
              Tout voir <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>

        {campaigns.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((c) => (
              <CampaignCard key={c.id} {...c} />
            ))}
          </div>
        ) : (
          <div
            className={cn(
              dashboardPanelClass,
              "flex flex-col items-start gap-3 p-6 md:p-8",
            )}
          >
            <p className="text-sm font-medium text-deep-green">
              Aucune campagne à afficher pour le moment.
            </p>
            <p className="text-sm text-deep-green/55">
              Parcourez les marchés ouverts dès que de nouvelles offres sont
              publiées.
            </p>
            <Button asChild className="mt-1 rounded-full bg-deep-green text-white">
              <Link href="/dashboard/markets">Voir les marchés</Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
