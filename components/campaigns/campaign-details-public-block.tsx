"use client";

import Link from "next/link";
import { differenceInCalendarDays } from "date-fns";
import { Check, MapPin, Medal, User } from "lucide-react";

import { AppBreadcrumb } from "@/components/app-breadcrumb";
import {
  CampaignCurrencyToggle,
  CampaignDisplayCurrencyProvider,
  useCampaignDisplayCurrency,
} from "@/components/campaigns/campaign-currency-toggle";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { formatDateRange } from "@/lib/format/date";
import type { PublicCampaignInvestorRow } from "@/lib/services/public-campaigns";

export type CampaignDetailsClientPayload = {
  title: string;
  slug: string;
  summary: string;
  description: string;
  locationLabel: string | null;
  activitySector: string | null;
  projectOwner: string | null;
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

function rankBubbleClass(rank: number) {
  if (rank === 1) return "bg-mint text-deep-green";
  if (rank === 2) return "bg-deep-green/15 text-deep-green";
  if (rank === 3) return "bg-deep-green/10 text-deep-green";
  return "bg-neutral-200 text-deep-green";
}

function medalClass(rank: number) {
  if (rank === 1) return "text-mint";
  if (rank === 2) return "text-neutral-400";
  if (rank === 3) return "text-deep-green/50";
  return "";
}

function heroImageUrl(campaign: CampaignDetailsClientPayload) {
  const cover = campaign.coverImageUrl?.trim();
  if (cover) return cover;
  const first = campaign.galleryImages[0]?.url?.trim();
  return first || null;
}

function sectorBadgeLabel(sector: string | null) {
  if (!sector?.trim()) return null;
  return sector.trim().replace(/_/g, " ").toUpperCase();
}

function timeRemainingLabel(endsAt: string | null) {
  if (!endsAt) return "—";
  const end = new Date(endsAt);
  const days = differenceInCalendarDays(end, new Date());
  if (days < 0) return "Terminé";
  if (days === 0) return "Dernier jour";
  return `${days} j`;
}

function fundingProgress(campaign: CampaignDetailsClientPayload) {
  if (campaign.goalAmount <= 0) return 0;
  return Math.min(
    100,
    Math.round((campaign.raisedAmount / campaign.goalAmount) * 100),
  );
}

function statusBadgeLabel(status: string, endsAt: string | null) {
  if (endsAt) {
    const days = differenceInCalendarDays(new Date(endsAt), new Date());
    if (days < 0) return "Terminé";
  }
  if (status === "LIVE") return "En direct";
  if (status === "FUNDED") return "Financé";
  if (status === "DRAFT") return "Brouillon";
  return status;
}

function FullBleedHero({ campaign }: { campaign: CampaignDetailsClientPayload }) {
  const src = heroImageUrl(campaign);
  const progress = fundingProgress(campaign);
  const sector = sectorBadgeLabel(campaign.activitySector);
  const statusLabel = statusBadgeLabel(campaign.status, campaign.endsAt);
  const isEnded = statusLabel === "Terminé";

  return (
    <section className="relative w-full min-h-[min(52vh,520px)] md:min-h-[min(58vh,580px)]">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={campaign.title}
          className="absolute inset-0 h-full w-full object-cover"
          decoding="async"
        />
      ) : (
        <div className="absolute inset-0 bg-deep-green" aria-hidden />
      )}
      {/* Base dim + bottom/left scrims so white copy stays readable on bright photos */}
      <div className="absolute inset-0 bg-black/45" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/25"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent"
        aria-hidden
      />
      <div className="relative z-10 flex min-h-[min(52vh,520px)] flex-col justify-between gap-8 md:min-h-[min(58vh,580px)]">
        <div className="px-4 pb-2 pt-24 md:px-8 md:pt-28 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <AppBreadcrumb tone="dark" className="text-xs sm:text-sm" />
          </div>
        </div>

        <div className="px-4 pb-10 md:px-8 lg:px-12">
          <div className="mx-auto max-w-6xl space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              {sector ? (
                <span className="inline-flex rounded-full bg-mint px-3 py-1 text-xs font-bold uppercase tracking-wide text-deep-green shadow-sm">
                  {sector}
                </span>
              ) : null}
              {campaign.isVerified ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-deep-green shadow-sm">
                  <Check className="size-3.5 shrink-0" strokeWidth={2.5} />
                  Vérifié
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-black/35 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    isEnded ? "bg-white/70" : "bg-mint",
                  )}
                />
                {statusLabel}
              </span>
            </div>

            <h1 className="max-w-4xl font-sans text-3xl font-semibold leading-[1.12] tracking-tight text-white sm:text-4xl md:text-5xl">
              {campaign.title}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
              {campaign.summary}
            </p>

            <div className="flex flex-col gap-3 text-sm text-white/90 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
              {campaign.projectOwner?.trim() ? (
                <span className="inline-flex items-center gap-2">
                  <User className="size-4 shrink-0 opacity-90" aria-hidden />
                  <span>
                    Par{" "}
                    <span className="font-semibold text-white">
                      {campaign.projectOwner.trim()}
                    </span>
                  </span>
                </span>
              ) : null}
              {campaign.locationLabel ? (
                <span className="inline-flex items-center gap-2">
                  <MapPin className="size-4 shrink-0 opacity-90" aria-hidden />
                  <span className="font-medium">{campaign.locationLabel}</span>
                </span>
              ) : null}
            </div>

            <div className="flex max-w-xl flex-col gap-3">
              <CampaignCurrencyToggle tone="dark" />
              <div className="flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/40 ring-1 ring-white/15">
                  <div
                    className="h-full rounded-full bg-mint"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="shrink-0 text-xs font-semibold tabular-nums text-white">
                  {progress}%
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <Button
                asChild
                className="rounded-full bg-mint px-8 font-semibold text-deep-green shadow-sm hover:bg-mint/90"
              >
                <Link href={`/campaigns/${campaign.slug}/invest`}>
                  Investir maintenant
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="rounded-full border-white/50 bg-black/30 text-white shadow-sm backdrop-blur hover:bg-black/45 hover:text-white"
              >
                <Link href="/campaigns">Toutes les campagnes</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsStrip({ campaign }: { campaign: CampaignDetailsClientPayload }) {
  const { convertFromBase, formatInDisplay } = useCampaignDisplayCurrency();
  const raised = convertFromBase(campaign.raisedAmount);
  const goal = convertFromBase(campaign.goalAmount);
  const investors = campaign.investors.length;
  const timeLeft = timeRemainingLabel(campaign.endsAt);

  return (
    <div className="border-b border-deep-green/10 bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-6 md:grid-cols-4 md:gap-8 md:px-8 lg:px-12">
        {[
          { label: "Collecté", value: formatInDisplay(raised) },
          { label: "Objectif", value: formatInDisplay(goal) },
          { label: "Investisseurs", value: String(investors) },
          {
            label: "Temps restant",
            value: timeLeft,
            accent:
              timeLeft !== "Terminé" && campaign.endsAt
                ? "text-deep-green"
                : "text-deep-green",
          },
        ].map((stat) => (
          <div key={stat.label}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-deep-green/45">
              {stat.label}
            </p>
            <p
              className={cn(
                "mt-1 font-sans text-lg font-semibold text-deep-green sm:text-xl",
                stat.accent,
              )}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
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
      <p className="text-sm text-deep-green/60">
        Pas encore d&apos;investissements. Soyez le premier.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {campaign.investors.map((inv) => (
        <div
          key={inv.userId}
          className="flex items-center justify-between rounded-xl border border-deep-green/10 bg-neutral-50 px-3 py-2.5"
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
              <p className="text-sm font-medium text-deep-green">
                #{inv.rank} {inv.name}
              </p>
              <span
                className={cn(
                  "mt-0.5 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                  inv.status === "PAID"
                    ? "border-mint/40 bg-mint/20 text-deep-green"
                    : "border-deep-green/15 bg-deep-green/5 text-deep-green/70",
                )}
              >
                {inv.status}
              </span>
            </div>
          </div>
          <p className="font-sans text-sm font-semibold text-deep-green">
            {formatInDisplay(convertFromBase(inv.amount))}
          </p>
        </div>
      ))}
    </div>
  );
}

function FundingAside({ campaign }: { campaign: CampaignDetailsClientPayload }) {
  const { convertFromBase, formatInDisplay } = useCampaignDisplayCurrency();
  const progress = fundingProgress(campaign);
  const raised = convertFromBase(campaign.raisedAmount);
  const investors = campaign.investors.length;
  const minInvestment =
    campaign.minimumInvestmentAmount != null
      ? formatInDisplay(convertFromBase(campaign.minimumInvestmentAmount))
      : null;

  return (
    <div className="rounded-2xl border border-deep-green/10 bg-white p-6 shadow-sm">
      <div className="flex items-end justify-between gap-4">
        <p className="font-sans text-5xl font-bold leading-none text-deep-green md:text-6xl">
          {progress}%
        </p>
        <p className="pb-1 text-right text-sm text-deep-green/60">
          <span className="font-semibold text-deep-green">{investors}</span>{" "}
          investisseur{investors !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-neutral-200">
        <div
          className="h-full rounded-full bg-mint"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-deep-green/50">
        {formatInDisplay(raised)} collectés
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 text-sm">
        <div className="rounded-xl border border-deep-green/10 bg-neutral-50 p-4">
          <p className="text-xs font-medium text-deep-green/50">
            Montant minimum
          </p>
          <p className="mt-1 font-semibold text-deep-green">
            {minInvestment ?? "N/A"}
          </p>
        </div>
        <div className="rounded-xl border border-deep-green/10 bg-neutral-50 p-4">
          <p className="text-xs font-medium text-deep-green/50">
            Rendement visé
          </p>
          <p className="mt-1 font-semibold text-deep-green">
            {campaign.targetReturnRate != null
              ? `${campaign.targetReturnRate}% / an`
              : "N/A"}
          </p>
        </div>
        <div className="rounded-xl border border-deep-green/10 bg-neutral-50 p-4">
          <p className="text-xs font-medium text-deep-green/50">Durée</p>
          <p className="mt-1 font-semibold text-deep-green">
            {campaign.durationMonths != null
              ? `${campaign.durationMonths} mois`
              : "N/A"}
          </p>
        </div>
      </div>

      <Button
        asChild
        className="mt-6 w-full rounded-xl bg-deep-green py-6 text-base font-semibold text-white hover:bg-deep-green/90"
      >
        <Link href={`/campaigns/${campaign.slug}/invest`}>
          Investir maintenant
        </Link>
      </Button>
      <p className="mt-2 text-center text-[11px] text-deep-green/45">
        Transaction sécurisée
      </p>

      <div className="mt-8 border-t border-deep-green/10 pt-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-deep-green/50">
          Classement des investisseurs
        </p>
        <InvestorRows campaign={campaign} />
      </div>
    </div>
  );
}

function StoryTabs({ campaign }: { campaign: CampaignDetailsClientPayload }) {
  const windowLabel = formatDateRange(campaign.startsAt, campaign.endsAt);
  const hasGallery = campaign.galleryImages.length > 0;
  const impact = campaign.impactPoints.filter(Boolean);

  const tabTriggerClass =
    "h-9 flex-none rounded-full border-0 bg-transparent px-4 py-2 text-sm font-medium text-deep-green/55 shadow-none after:hidden hover:text-deep-green data-[state=active]:bg-deep-green data-[state=active]:text-white data-[state=active]:shadow-sm";

  return (
    <Tabs defaultValue="about" className="w-full gap-5">
      <TabsList className="mb-0 h-auto w-full min-w-0 flex-wrap justify-start gap-1 rounded-full border border-deep-green/10 bg-white p-1 shadow-sm sm:w-fit">
        <TabsTrigger value="about" className={tabTriggerClass}>
          À propos
        </TabsTrigger>
        <TabsTrigger value="impact" className={tabTriggerClass}>
          Impact
        </TabsTrigger>
        {hasGallery ? (
          <TabsTrigger value="gallery" className={tabTriggerClass}>
            Galerie
          </TabsTrigger>
        ) : null}
      </TabsList>

      <TabsContent value="about" className="mt-0 space-y-6 text-sm text-deep-green/75">
        <div className="rounded-2xl border border-deep-green/10 bg-white p-6 shadow-sm md:p-8">
          <p className="leading-relaxed whitespace-pre-wrap">
            {campaign.description}
          </p>
          <div className="mt-6 grid gap-3 border-t border-deep-green/10 pt-6 sm:grid-cols-2">
            <p>
              <span className="font-medium text-deep-green">Devise (base)</span>
              <br />
              {campaign.currency}
            </p>
            <p>
              <span className="font-medium text-deep-green">Fenêtre</span>
              <br />
              {windowLabel}
            </p>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="impact" className="mt-0">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-deep-green/10 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-deep-green/50">
              Impact attendu
            </p>
            <p className="mt-2 text-sm leading-relaxed text-deep-green/80">
              {impact[0] ??
                "Le financement accélère l'équipement local et la production durable."}
            </p>
          </div>
          <div className="rounded-2xl border border-deep-green/10 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-deep-green/50">
              Exécution
            </p>
            <p className="mt-2 text-sm leading-relaxed text-deep-green/80">
              {impact[1] ??
                "Les fonds sont débloqués suivant des jalons de projet vérifiés."}
            </p>
          </div>
        </div>
        {impact.length > 2 ? (
          <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-deep-green/70">
            {impact.slice(2).map((pt) => (
              <li key={pt}>{pt}</li>
            ))}
          </ul>
        ) : null}
      </TabsContent>

      {hasGallery ? (
        <TabsContent value="gallery" className="mt-0">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {campaign.galleryImages.slice(0, 9).map((image, idx) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${image.url}-${idx}`}
                src={image.url}
                alt={image.alt || `${campaign.title} — ${idx + 1}`}
                className={cn(
                  "aspect-[4/3] w-full rounded-xl border border-deep-green/10 object-cover",
                  idx === 0 &&
                    "col-span-2 row-span-2 aspect-auto min-h-[220px] sm:min-h-[280px]",
                )}
              />
            ))}
          </div>
        </TabsContent>
      ) : null}
    </Tabs>
  );
}

export function CampaignDetailsPublicBlock({
  campaign,
  rates,
}: {
  campaign: CampaignDetailsClientPayload;
  rates: Record<string, number>;
}) {
  return (
    <CampaignDisplayCurrencyProvider
      baseCurrency={campaign.currency}
      rates={rates}
    >
      <FullBleedHero campaign={campaign} />
      <StatsStrip campaign={campaign} />
      <div className="bg-neutral-100">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,400px)] lg:items-start lg:gap-12">
            <div className="min-w-0">
              <StoryTabs campaign={campaign} />
            </div>
            <aside className="min-w-0 shrink-0 lg:sticky lg:top-28">
              <FundingAside campaign={campaign} />
            </aside>
          </div>
        </div>
      </div>
    </CampaignDisplayCurrencyProvider>
  );
}
