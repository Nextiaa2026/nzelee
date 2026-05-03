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

function FullBleedHero({ campaign }: { campaign: CampaignDetailsClientPayload }) {
  const src = heroImageUrl(campaign);
  const progress = fundingProgress(campaign);
  const sector = sectorBadgeLabel(campaign.activitySector);

  return (
    <section className="relative w-full min-h-[min(58vh,560px)] md:min-h-[min(64vh,640px)]">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={campaign.title}
          className="absolute inset-0 h-full w-full object-cover"
          decoding="async"
        />
      ) : (
        <div
          className="absolute inset-0 bg-deep-green"
          aria-hidden
        />
      )}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/45 to-black/25"
        aria-hidden
      />
      <div className="relative z-10 flex min-h-[min(58vh,560px)] flex-col md:min-h-[min(64vh,640px)]">
        <div className="flex flex-col gap-4 px-4 pb-4 pt-28 sm:flex-row sm:items-start sm:justify-between md:px-8 md:pt-32 lg:px-12">
          <div className="[&_a]:text-white/85 [&_a:hover]:text-white [&_nav]:text-white/90 [&_svg]:text-white/70">
            <AppBreadcrumb className="text-xs sm:text-sm" />
          </div>
          <nav className="flex flex-wrap justify-end gap-x-4 gap-y-1 text-[11px] font-medium text-white/75 sm:text-xs">
            <Link href="/privacy-policy" className="hover:text-white">
              Politique de confidentialité
            </Link>
            <Link href="/terms-of-service" className="hover:text-white">
              Conditions d&apos;utilisation
            </Link>
            <Link href="/contact" className="hover:text-white">
              Contact
            </Link>
          </nav>
        </div>

        <div className="mt-auto px-4 pb-10 md:px-8 lg:px-12">
          <div className="mx-auto max-w-6xl space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              {sector ? (
                <span className="inline-flex rounded-full bg-amber-300 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-950">
                  {sector}
                </span>
              ) : null}
              {campaign.isVerified ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-mint/95 px-3 py-1 text-xs font-semibold text-deep-green">
                  <Check className="size-3.5 shrink-0" strokeWidth={2.5} />
                  Vérifié
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-mint pulse" />
                {campaign.status}
              </span>
            </div>

            <h1 className="max-w-4xl font-display text-3xl font-semibold leading-[1.12] tracking-tight text-white text-glow sm:text-4xl md:text-5xl">
              {campaign.title}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
              {campaign.summary}
            </p>

            <div className="flex flex-col gap-3 text-sm text-white/90 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
              {campaign.projectOwner?.trim() ? (
                <span className="inline-flex items-center gap-2">
                  <User className="size-4 shrink-0 opacity-80" aria-hidden />
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
                  <MapPin className="size-4 shrink-0 opacity-80" aria-hidden />
                  <span className="font-medium">{campaign.locationLabel}</span>
                </span>
              ) : null}
            </div>

            <div className="flex max-w-xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <CampaignCurrencyToggle tone="dark" />
              <div className="hidden h-2 flex-1 overflow-hidden rounded-full bg-white/15 sm:block sm:max-w-xs">
                <div
                  className="h-full rounded-full bg-mint"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="h-2 max-w-xl overflow-hidden rounded-full bg-white/15 sm:hidden">
              <div
                className="h-full rounded-full bg-mint"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <Button
                asChild
                className="rounded-full bg-mint px-8 font-semibold text-deep-green shadow-lg hover:bg-mint/90"
              >
                <Link href={`/campaigns/${campaign.slug}/invest`}>
                  Investir maintenant
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="rounded-full border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/15"
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
    <div className="border-b border-black/10 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-6 md:grid-cols-4 md:gap-8 md:px-8 lg:px-12">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/45">
            Collecté
          </p>
          <p className="mt-1 font-display text-lg font-semibold text-deep-green sm:text-xl">
            {formatInDisplay(raised)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/45">
            Objectif
          </p>
          <p className="mt-1 font-display text-lg font-semibold text-deep-green sm:text-xl">
            {formatInDisplay(goal)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/45">
            Investisseurs
          </p>
          <p className="mt-1 font-display text-lg font-semibold text-deep-green sm:text-xl">
            {investors}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/45">
            Temps restant
          </p>
          <p
            className={cn(
              "mt-1 font-display text-lg font-semibold sm:text-xl",
              timeLeft !== "Terminé" && campaign.endsAt
                ? "text-orange-600"
                : "text-deep-green",
            )}
          >
            {timeLeft}
          </p>
        </div>
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
      <p className="text-sm text-black/60">
        Pas encore d&apos;investissements. Soyez le premier.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {campaign.investors.map((inv) => (
        <div
          key={inv.userId}
          className="flex items-center justify-between rounded-xl border border-black/10 bg-slate-50/90 px-3 py-2.5"
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

function FundingAside({ campaign }: { campaign: CampaignDetailsClientPayload }) {
  const { convertFromBase, formatInDisplay } = useCampaignDisplayCurrency();
  const progress = fundingProgress(campaign);
  const raised = convertFromBase(campaign.raisedAmount);
  const investors = campaign.investors.length;

  return (
    <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-[0_8px_40px_rgba(0,0,0,0.06)]">
      <div className="flex items-end justify-between gap-4">
        <p className="font-display text-5xl font-bold leading-none text-deep-green md:text-6xl">
          {progress}%
        </p>
        <p className="pb-1 text-right text-sm text-black/60">
          <span className="font-semibold text-black/85">{investors}</span>{" "}
          investisseur{investors !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-black/10">
        <div
          className="h-full rounded-full bg-mint"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-black/50">
        {formatInDisplay(raised)} collectés
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 text-sm">
        <div className="rounded-2xl border border-black/10 bg-slate-50/90 p-4">
          <p className="text-xs font-medium text-black/50">Montant minimum</p>
          <p className="mt-1 font-semibold text-black/90">
            {campaign.minimumInvestmentAmount != null
              ? `${campaign.minimumInvestmentAmount.toLocaleString()} ${campaign.currency}`
              : "N/A"}
          </p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-slate-50/90 p-4">
          <p className="text-xs font-medium text-black/50">Rendement visé</p>
          <p className="mt-1 font-semibold text-mint">
            {campaign.targetReturnRate != null
              ? `${campaign.targetReturnRate}% / an`
              : "N/A"}
          </p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-slate-50/90 p-4">
          <p className="text-xs font-medium text-black/50">Durée</p>
          <p className="mt-1 font-semibold text-black/90">
            {campaign.durationMonths != null
              ? `${campaign.durationMonths} mois`
              : "N/A"}
          </p>
        </div>
      </div>

      <Button
        asChild
        className="mt-6 w-full rounded-2xl bg-deep-green py-6 text-base font-semibold text-white hover:bg-deep-green/90"
      >
        <Link href={`/campaigns/${campaign.slug}/invest`}>
          Investir maintenant
        </Link>
      </Button>
      <p className="mt-2 text-center text-[11px] text-black/45">
        Transaction sécurisée
      </p>

      <div className="mt-8 border-t border-black/10 pt-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-black/50">
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

  return (
    <Tabs defaultValue="about" className="w-full">
      <TabsList
        variant="line"
        className="mb-6 h-auto w-full min-w-0 flex-wrap justify-start gap-x-8 gap-y-2 rounded-none border-0 bg-transparent p-0"
      >
        <TabsTrigger value="about" className="rounded-none px-0 py-2 text-sm data-active:after:opacity-100">
          À propos
        </TabsTrigger>
        <TabsTrigger value="impact" className="rounded-none px-0 py-2 text-sm data-active:after:opacity-100">
          Impact
        </TabsTrigger>
        {hasGallery ? (
          <TabsTrigger value="gallery" className="rounded-none px-0 py-2 text-sm data-active:after:opacity-100">
            Galerie
          </TabsTrigger>
        ) : null}
      </TabsList>

      <TabsContent value="about" className="space-y-6 text-sm text-black/75">
        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm md:p-8">
          <p className="leading-relaxed whitespace-pre-wrap">{campaign.description}</p>
          <div className="mt-6 grid gap-3 border-t border-black/10 pt-6 sm:grid-cols-2">
            <p>
              <span className="font-medium text-black/90">Devise (base)</span>
              <br />
              {campaign.currency}
            </p>
            <p>
              <span className="font-medium text-black/90">Fenêtre</span>
              <br />
              {windowLabel}
            </p>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="impact">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
              Impact attendu
            </p>
            <p className="mt-2 text-sm leading-relaxed text-emerald-950/80">
              {impact[0] ??
                "Le financement accélère l'équipement local et la production durable."}
            </p>
          </div>
          <div className="rounded-3xl border border-sky-100 bg-sky-50/70 p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-800">
              Exécution
            </p>
            <p className="mt-2 text-sm leading-relaxed text-sky-950/80">
              {impact[1] ??
                "Les fonds sont débloqués suivant des jalons de projet vérifiés."}
            </p>
          </div>
        </div>
        {impact.length > 2 ? (
          <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-black/70">
            {impact.slice(2).map((pt) => (
              <li key={pt}>{pt}</li>
            ))}
          </ul>
        ) : null}
      </TabsContent>

      {hasGallery ? (
        <TabsContent value="gallery">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {campaign.galleryImages.slice(0, 9).map((image, idx) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${image.url}-${idx}`}
                src={image.url}
                alt={image.alt || `${campaign.title} — ${idx + 1}`}
                className={cn(
                  "aspect-[4/3] w-full rounded-2xl border border-black/10 object-cover",
                  idx === 0 && "col-span-2 row-span-2 aspect-auto min-h-[220px] sm:min-h-[280px]",
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
      <div className="bg-zinc-50/80">
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
