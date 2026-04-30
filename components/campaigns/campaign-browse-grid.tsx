"use client";

import { useMemo, useState } from "react";
import { Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

import { CampaignCard } from "@/components/campaigns/campaign-card";
import type { PublicCampaignBrowseRow } from "@/lib/services/public-campaigns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  campaigns: PublicCampaignBrowseRow[];
  /** Where to send guests who sign in to save a favorite (default: public browse). */
  loginCallbackPath?: string;
};

const ITEMS_PER_PAGE = 6;

export function CampaignBrowseGrid({
  campaigns,
}: Props) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "LIVE" | "FUNDED">("ALL");
  const [featuredFilter, setFeaturedFilter] = useState<"ALL" | "FEATURED" | "NON_FEATURED">(
    "ALL",
  );
  const [currencyFilter, setCurrencyFilter] = useState<"ALL" | string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);

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



  const totalPages = Math.ceil(filteredCampaigns.length / ITEMS_PER_PAGE);
  const paginatedCampaigns = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCampaigns.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCampaigns, currentPage]);

  if (!campaigns.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-foreground/10 bg-surface-muted/30 px-6 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground/5 text-foreground/30">
          <Filter className="h-8 w-8" />
        </div>
        <h3 className="mt-4 font-display text-lg">No campaigns yet</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-xs">
          Check back soon or explore our active markets to start investing.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-4">
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-deep-green transition-colors" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search campaigns..."
            className="h-12 rounded-2xl border-foreground/10 bg-white pl-10 pr-4 shadow-sm focus-visible:ring-deep-green/20"
          />
        </div>
        
        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide md:overflow-visible">
          <div className="flex shrink-0 items-center gap-2 rounded-xl bg-foreground/5 px-3 py-2 text-xs font-semibold text-foreground/60">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
          </div>
          
          <Select value={statusFilter} onValueChange={(v) => {
            setStatusFilter(v as typeof statusFilter);
            setCurrentPage(1);
          }}>
            <SelectTrigger className="h-9 w-auto gap-2 rounded-xl border-foreground/10 bg-white px-4 text-xs font-medium shadow-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-foreground/10">
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="LIVE">Live</SelectItem>
              <SelectItem value="FUNDED">Funded</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={featuredFilter}
            onValueChange={(v) => {
              setFeaturedFilter(v as typeof featuredFilter);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-auto gap-2 rounded-xl border-foreground/10 bg-white px-4 text-xs font-medium shadow-sm">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-foreground/10">
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="FEATURED">Featured</SelectItem>
              <SelectItem value="NON_FEATURED">Standard</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={currencyFilter}
            onValueChange={(v) => {
              setCurrencyFilter(v);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-auto gap-2 rounded-xl border-foreground/10 bg-white px-4 text-xs font-medium shadow-sm">
              <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-foreground/10">
              <SelectItem value="ALL">All Currencies</SelectItem>
              {currencies.map((ccy) => (
                <SelectItem key={ccy} value={ccy}>
                  {ccy}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!filteredCampaigns.length ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-foreground/10 bg-surface-muted/30 px-6 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No campaigns match your search/filter right now.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedCampaigns.map((c) => (
              <CampaignCard key={c.id} {...c} />
            ))}
          </div>
          
          <div className="flex items-center justify-between border-t border-foreground/10 pt-6">
            <p className="text-sm text-muted-foreground">
              Showing {filteredCampaigns.length > 0 ? ((currentPage - 1) * ITEMS_PER_PAGE) + 1 : 0} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredCampaigns.length)} of {filteredCampaigns.length}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || totalPages === 0}
                className="rounded-xl"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1 px-2 text-sm font-medium">
                {totalPages > 0 ? currentPage : 0} <span className="text-muted-foreground">/ {totalPages}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages || totalPages === 0}
                className="rounded-xl"
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
