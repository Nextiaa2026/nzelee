"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { CampaignFavoriteButton } from "@/components/dashboard/campaign-favorite-button";
import type { PublicCampaignBrowseRow } from "@/lib/services/public-campaigns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function formatMoneyCents(amount: number, currency: string) {
  const code = currency.length === 3 ? currency : "USD";
  return (amount / 100).toLocaleString(undefined, {
    style: "currency",
    currency: code,
    maximumFractionDigits: 0,
  });
}

type Props = {
  campaigns: PublicCampaignBrowseRow[];
  /** Where to send guests who sign in to save a favorite (default: public browse). */
  loginCallbackPath?: string;
};

export function CampaignBrowseGrid({
  campaigns,
  loginCallbackPath = "/campaigns",
}: Props) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "LIVE" | "FUNDED">("ALL");
  const [featuredFilter, setFeaturedFilter] = useState<"ALL" | "FEATURED" | "NON_FEATURED">(
    "ALL",
  );
  const [currencyFilter, setCurrencyFilter] = useState<"ALL" | string>("ALL");

  const currencies = useMemo(
    () => Array.from(new Set(campaigns.map((c) => c.currency))).sort(),
    [campaigns],
  );

  const filteredCampaigns = useMemo(() => {
    const q = query.trim().toLowerCase();
    return campaigns.filter((c) => {
      if (statusFilter !== "ALL" && c.status !== statusFilter) return false;
      if (featuredFilter === "FEATURED" && !c.isFeatured) return false;
      if (featuredFilter === "NON_FEATURED" && c.isFeatured) return false;
      if (currencyFilter !== "ALL" && c.currency !== currencyFilter) return false;
      if (!q) return true;
      return (
        c.title.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q)
      );
    });
  }, [campaigns, currencyFilter, featuredFilter, query, statusFilter]);

  if (!campaigns.length) {
    return (
      <p className="rounded-2xl border border-dashed bg-muted/30 px-6 py-12 text-center text-sm text-muted-foreground">
        No live campaigns yet. Check back soon, or create one from your dashboard.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-[1.5fr_repeat(3,minmax(0,1fr))]">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, summary, or slug"
          className="h-10"
        />
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All status</SelectItem>
            <SelectItem value="LIVE">Live</SelectItem>
            <SelectItem value="FUNDED">Funded</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={featuredFilter}
          onValueChange={(v) => setFeaturedFilter(v as typeof featuredFilter)}
        >
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Featured" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All campaigns</SelectItem>
            <SelectItem value="FEATURED">Featured only</SelectItem>
            <SelectItem value="NON_FEATURED">Non-featured</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={currencyFilter}
          onValueChange={(v) => setCurrencyFilter(v)}
        >
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All currencies</SelectItem>
            {currencies.map((ccy) => (
              <SelectItem key={ccy} value={ccy}>
                {ccy}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!filteredCampaigns.length ? (
        <p className="rounded-2xl border border-dashed bg-muted/30 px-6 py-12 text-center text-sm text-muted-foreground">
          No campaigns match your search/filter right now.
        </p>
      ) : null}

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {filteredCampaigns.map((c) => {
        const pct = c.goalAmount > 0 ? Math.min(100, Math.round((c.raisedAmount / c.goalAmount) * 100)) : 0;
        return (
          <li key={c.id}>
            <Card className="flex h-full flex-col overflow-hidden pt-0">
              <div className="relative aspect-16/10 w-full bg-muted">
                {c.coverImageUrl ? (
                  // External campaign art (e.g. Cloudinary); avoid coupling next/image to every host.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.coverImageUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    No cover image
                  </div>
                )}
                <div className="absolute right-2 top-2">
                  <CampaignFavoriteButton campaignId={c.id} loginCallbackPath={loginCallbackPath} />
                </div>
              </div>
              <CardHeader className="gap-1 pb-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {c.status}
                  </p>
                  {c.isFeatured ? (
                    <span className="rounded-full bg-mint/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-mint-foreground">
                      Featured
                    </span>
                  ) : null}
                </div>
                <h2 className="text-lg font-semibold leading-snug">
                  <Link href={`/campaigns/${c.slug}`} className="hover:underline">
                    {c.title}
                  </Link>
                </h2>
                <p className="line-clamp-2 text-sm text-muted-foreground">{c.summary}</p>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-3 pb-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Raised</span>
                    <span>
                      {formatMoneyCents(c.raisedAmount, c.currency)} of{" "}
                      {formatMoneyCents(c.goalAmount, c.currency)}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-[width]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="mt-auto flex items-center justify-between border-t bg-muted/30 py-3 text-xs text-muted-foreground">
                <span>
                  Slug: <span className="font-mono">{c.slug}</span>
                </span>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/campaigns/${c.slug}`}>View details</Link>
                </Button>
              </CardFooter>
            </Card>
          </li>
        );
      })}
      </ul>
    </div>
  );
}
