"use client";

import Link from "next/link";

import {
  CampaignCurrencyToggle,
  CampaignDisplayCurrencyProvider,
  useCampaignDisplayCurrency,
} from "@/components/campaigns/campaign-currency-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CampaignInvestHeroCardProps = {
  title: string;
  summary: string;
  status: string;
  coverImageUrl: string | null;
  raisedAmount: number;
  goalAmount: number;
  baseCurrency: string;
  rates: Record<string, number>;
};

function InvestHeroInner({
  title,
  summary,
  status,
  coverImageUrl,
  raisedAmount,
  goalAmount,
}: Omit<CampaignInvestHeroCardProps, "rates" | "baseCurrency">) {
  const { convertFromBase, formatInDisplay } = useCampaignDisplayCurrency();
  const raisedDisplay = convertFromBase(raisedAmount);
  const goalDisplay = convertFromBase(goalAmount);
  const pct =
    goalAmount > 0
      ? Math.min(100, Math.round((raisedAmount / goalAmount) * 100))
      : 0;
  const statsLine = `${formatInDisplay(raisedDisplay)} raised of ${formatInDisplay(goalDisplay)} (${pct}%)`;

  return (
    <div className="grid md:grid-cols-[1.08fr_0.92fr]">
      <div className="order-2 flex flex-col justify-between gap-8 p-8 md:order-1 md:p-10 lg:min-h-[min(100%,360px)] lg:gap-10">
        <div className="space-y-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-mint/35 bg-mint/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-mint">
            <span className="size-1.5 shrink-0 rounded-full bg-mint shadow-[0_0_10px_var(--color-mint)]" />
            {status}
          </span>
          <h1
            className={cn(
              "font-display text-4xl font-bold leading-[1.08] tracking-tight text-mint sm:text-5xl",
              "text-glow",
            )}
          >
            {title}
          </h1>
          <p className="max-w-xl text-[15px] leading-relaxed text-white/80">{summary}</p>
          <CampaignCurrencyToggle tone="dark" />
        </div>

        <div className="space-y-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/25">
            <div
              className="h-full rounded-full bg-mint transition-[width] duration-700 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-sm font-medium tabular-nums text-white/95">{statsLine}</p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Button
              asChild
              className="rounded-xl border-0 bg-mint px-6 font-semibold text-mint-foreground shadow-none hover:bg-mint/90"
            >
              <a href="#checkout-actions">Invest in this campaign</a>
            </Button>
            <Button
              asChild
              variant="secondary"
              className="rounded-xl border-0 bg-white px-6 font-semibold text-foreground shadow-none hover:bg-white/90"
            >
              <Link href="/campaigns">Back to campaigns</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="relative order-1 min-h-[220px] md:order-2 md:min-h-[min(100%,380px)]">
        {coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- remote campaign art (Cloudinary, etc.)
          <img
            src={coverImageUrl}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <div className="flex h-full min-h-[220px] flex-col items-center justify-center bg-white/8 text-center text-sm text-white/45 md:min-h-full">
            No campaign image
          </div>
        )}
      </div>
    </div>
  );
}

export function CampaignInvestHeroCard({
  rates,
  baseCurrency,
  title,
  summary,
  status,
  coverImageUrl,
  raisedAmount,
  goalAmount,
}: CampaignInvestHeroCardProps) {
  return (
    <CampaignDisplayCurrencyProvider baseCurrency={baseCurrency} rates={rates}>
      <div className="mb-10 overflow-hidden rounded-3xl bg-deep-green text-deep-green-foreground ring-1 ring-white/10">
        <InvestHeroInner
          title={title}
          summary={summary}
          status={status}
          coverImageUrl={coverImageUrl}
          raisedAmount={raisedAmount}
          goalAmount={goalAmount}
        />
      </div>
    </CampaignDisplayCurrencyProvider>
  );
}
