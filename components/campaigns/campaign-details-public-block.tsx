"use client";

import Link from "next/link";
import { Medal } from "lucide-react";

import {
  CampaignCurrencyToggle,
  CampaignDisplayCurrencyProvider,
  useCampaignDisplayCurrency,
} from "@/components/campaigns/campaign-currency-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDateRange } from "@/lib/format/date";
import type { PublicCampaignInvestorRow } from "@/lib/services/public-campaigns";

export type CampaignDetailsClientPayload = {
  title: string;
  slug: string;
  summary: string;
  description: string;
  locationLabel: string | null;
  isVerified: boolean;
  status: string;
  coverImageUrl: string | null;
  minimumInvestmentAmount: number | null;
  targetReturnRate: number | null;
  durationMonths: number | null;
  galleryImages: Array<{ url: string; alt?: string }>;
  impactPoints: string[];
  goalAmount: number;
  raisedAmount: number;
  currency: string;
  startsAt: string | null;
  endsAt: string | null;
  investors: PublicCampaignInvestorRow[];
};

const RANK_BUBBLE: Record<number, string> = {
  1: "bg-mint text-mint-foreground",
  2: "bg-amber-200 text-foreground",
  3: "bg-rose-200 text-foreground",
  4: "bg-emerald-200 text-foreground",
  5: "bg-sky-200 text-foreground",
  6: "bg-violet-200 text-foreground",
  7: "bg-orange-200 text-foreground",
};

function rankBubbleClass(rank: number) {
  return RANK_BUBBLE[rank] ?? "bg-teal-200 text-foreground";
}

function medalClass(rank: number) {
  if (rank === 1) return "text-amber-500";
  if (rank === 2) return "text-slate-400";
  if (rank === 3) return "text-amber-800";
  return "";
}

function HeroStats({ campaign }: { campaign: CampaignDetailsClientPayload }) {
  const { convertFromBase, formatInDisplay } = useCampaignDisplayCurrency();
  const raised = convertFromBase(campaign.raisedAmount);
  const goal = convertFromBase(campaign.goalAmount);
  const progress =
    campaign.goalAmount > 0
      ? Math.min(
          100,
          Math.round((campaign.raisedAmount / campaign.goalAmount) * 100),
        )
      : 0;

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <p className="inline-flex w-fit items-center gap-2 rounded-full border border-mint/30 bg-mint/15 px-3 py-1 text-xs font-medium text-mint">
          <span className="h-1.5 w-1.5 rounded-full bg-mint pulse" />
          {campaign.status}
        </p>
        {campaign.isVerified ? (
          <p className="inline-flex w-fit items-center rounded-full border border-emerald-300/60 bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900">
            Verified
          </p>
        ) : null}
      </div>
      <h1 className="font-display text-4xl tracking-tight text-mint text-glow sm:text-5xl">
        {campaign.title}
      </h1>
      <p className="max-w-2xl text-sm text-deep-green-foreground/75">
        {campaign.summary}
      </p>
      {campaign.locationLabel ? (
        <p className="text-xs font-semibold uppercase tracking-wider text-deep-green-foreground/60">
          {campaign.locationLabel}
        </p>
      ) : null}
      <CampaignCurrencyToggle className="pt-1" />
      <div className="h-2 overflow-hidden rounded-full bg-black/10">
        <div
          className="h-full rounded-full bg-mint"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-sm text-deep-green-foreground/75">
        <span className="font-display font-semibold text-deep-green-foreground/90">
          {formatInDisplay(raised)}
        </span>{" "}
        raised of{" "}
        <span className="font-display font-semibold text-deep-green-foreground/90">
          {formatInDisplay(goal)}
        </span>{" "}
        ({progress}%)
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          asChild
          className="bg-mint text-mint-foreground hover:bg-mint/90"
        >
          <Link href={`/campaigns/${campaign.slug}/invest`}>
            Invest in this campaign
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/campaigns">Back to campaigns</Link>
        </Button>
      </div>
    </>
  );
}

function InvestorRows({
  campaign,
}: {
  campaign: CampaignDetailsClientPayload;
}) {
  const { convertFromBase, formatInDisplay } = useCampaignDisplayCurrency();

  if (!campaign.investors.length) {
    return (
      <p className="text-sm text-black/60">
        No investments yet. Be the first backer.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {campaign.investors.map((inv) => (
        <div
          key={inv.userId}
          className="flex items-center justify-between rounded-xl border border-black/10 bg-white/70 px-3 py-2"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold",
                  rankBubbleClass(inv.rank),
                )}
              >
                {inv.initials}
              </div>
              {inv.rank <= 3 ? (
                <Medal
                  className={cn(
                    "absolute -right-1 -top-1 size-5",
                    medalClass(inv.rank),
                  )}
                  strokeWidth={1.75}
                  aria-hidden
                />
              ) : null}
            </div>
            <div>
              <p className="text-sm font-medium text-black/90">
                #{inv.rank} {inv.name}
              </p>
              <span
                className={cn(
                  "mt-0.5 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                  inv.status === "PAID"
                    ? "border-mint/30 bg-mint/15 text-mint"
                    : "border-amber-300/50 bg-amber-100 text-amber-900",
                )}
              >
                {inv.status}
              </span>
            </div>
          </div>
          <p className="font-display text-sm font-semibold text-black/85">
            {formatInDisplay(convertFromBase(inv.amount))}
          </p>
        </div>
      ))}
    </div>
  );
}

export function CampaignDetailsPublicBlock({
  campaign,
  rates,
}: {
  campaign: CampaignDetailsClientPayload;
  rates: Record<string, number>;
}) {
  const windowLabel = formatDateRange(campaign.startsAt, campaign.endsAt);

  return (
    <CampaignDisplayCurrencyProvider
      baseCurrency={campaign.currency}
      rates={rates}
    >
      <section className="hero-glow mb-8 grid gap-6 rounded-3xl border border-black/10 bg-hero-bg p-6 md:grid-cols-[1.15fr_.85fr] md:p-8">
        <div className="space-y-4">
          <HeroStats campaign={campaign} />
        </div>
        <div className="relative min-h-64 overflow-hidden rounded-2xl border border-black/10 bg-white/70">
          {campaign.coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={campaign.coverImageUrl}
              alt={campaign.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-64 items-center justify-center text-sm text-black/50">
              No campaign image
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[1fr_.95fr]">
        <Card className="rounded-2xl border border-black/10 bg-white shadow-none">
          <CardHeader>
            <CardTitle>A propos</CardTitle>
            <CardDescription>
              Contexte complet du projet et objectifs d'impact.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-black/75">
            <p>{campaign.description}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <p>
                <span className="font-medium text-black/90">Currency:</span>{" "}
                {campaign.currency}
              </p>
              <p>
                <span className="font-medium text-black/90">Window:</span>{" "}
                {windowLabel}
              </p>
            </div>
            <div className="grid gap-3 pt-2 sm:grid-cols-2">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                  Impact attendu
                </p>
                <p className="mt-1 text-xs text-emerald-900/70">
                  {campaign.impactPoints[0] ??
                    "Le financement accelere l'equipement local et la production durable."}
                </p>
              </div>
              <div className="rounded-xl border border-sky-100 bg-sky-50/60 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-sky-800">
                  Execution
                </p>
                <p className="mt-1 text-xs text-sky-900/70">
                  {campaign.impactPoints[1] ??
                    "Les fonds sont debloques suivant des jalons de projet verifies."}
                </p>
              </div>
            </div>
            {campaign.galleryImages.length ? (
              <div className="grid grid-cols-2 gap-2 pt-2 md:grid-cols-3">
                {campaign.galleryImages.slice(0, 6).map((image, idx) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={`${image.url}-${idx}`}
                    src={image.url}
                    alt={image.alt || `${campaign.title} gallery ${idx + 1}`}
                    className="h-24 w-full rounded-lg border border-black/10 object-cover"
                  />
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-black/10 bg-white shadow-none">
          <CardHeader>
            <CardTitle>Funding status</CardTitle>
            <CardDescription>
              Etat en temps reel des contributions investisseurs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border border-black/10 bg-slate-50/80 p-2">
                <p className="text-black/50">Montant minimum</p>
                <p className="font-semibold text-black/90">
                  {campaign.minimumInvestmentAmount
                    ? campaign.minimumInvestmentAmount.toLocaleString()
                    : "N/A"}{" "}
                  {campaign.currency}
                </p>
              </div>
              <div className="rounded-lg border border-black/10 bg-slate-50/80 p-2">
                <p className="text-black/50">Rendement vise</p>
                <p className="font-semibold text-black/90">
                  {campaign.targetReturnRate != null
                    ? `${campaign.targetReturnRate}% / an`
                    : "N/A"}
                </p>
              </div>
              <div className="col-span-2 rounded-lg border border-black/10 bg-slate-50/80 p-2">
                <p className="text-black/50">Duree</p>
                <p className="font-semibold text-black/90">
                  {campaign.durationMonths != null
                    ? `${campaign.durationMonths} mois`
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className="mb-4 rounded-xl border border-black/10 bg-slate-50/70 p-3 text-xs text-black/70">
              Classement des investisseurs actifs sur cette campagne.
            </div>
            <InvestorRows campaign={campaign} />
          </CardContent>
        </Card>
      </section>
    </CampaignDisplayCurrencyProvider>
  );
}
