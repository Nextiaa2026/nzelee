"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useTransition } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FilterIcon,
  SearchIcon,
} from "lucide-react";

import { CampaignCard } from "@/components/campaigns/campaign-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PublicCampaignBrowseRow } from "@/lib/services/public-campaigns";

type CampaignFilter = "All" | "Live" | "Funded" | "Featured";

const FILTERS: CampaignFilter[] = ["All", "Live", "Funded", "Featured"];
const ITEMS_PER_PAGE = 9;

export function CampaignsPageClient({
  campaigns,
  initialPage = 1,
  initialSearch = "",
  initialFilter = "All",
}: {
  campaigns: PublicCampaignBrowseRow[];
  initialPage?: number;
  initialSearch?: string;
  initialFilter?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentPage = Number(searchParams.get("page")) || initialPage;
  const searchQuery = searchParams.get("search") || initialSearch;
  const filter = (searchParams.get("filter") ||
    initialFilter) as CampaignFilter;
  const currencyFilter = searchParams.get("currency") || "all";
  const sortBy = searchParams.get("sort") || "featured";

  // Extract unique currencies from campaigns
  const currencies = useMemo(() => {
    const uniqueCurrencies = Array.from(
      new Set(campaigns.map((c) => c.currency)),
    );
    return uniqueCurrencies.sort();
  }, [campaigns]);

  const filteredCampaigns = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let filtered = campaigns.filter((c) => {
      // Apply status filter
      if (filter === "Live" && c.status !== "LIVE") return false;
      if (filter === "Funded" && c.status !== "FUNDED") return false;
      if (filter === "Featured" && !c.isFeatured) return false;

      // Apply currency filter
      if (currencyFilter !== "all" && c.currency !== currencyFilter)
        return false;

      // Apply search
      if (!q) return true;
      return (
        c.title.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q)
      );
    });

    // Apply sorting
    if (sortBy === "featured") {
      filtered.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
      });
    } else if (sortBy === "newest") {
      // Campaigns are already sorted by updatedAt from the backend
    } else if (sortBy === "goal-high") {
      filtered.sort((a, b) => b.goalAmount - a.goalAmount);
    } else if (sortBy === "goal-low") {
      filtered.sort((a, b) => a.goalAmount - b.goalAmount);
    } else if (sortBy === "progress") {
      filtered.sort((a, b) => {
        const pctA = a.goalAmount > 0 ? a.raisedAmount / a.goalAmount : 0;
        const pctB = b.goalAmount > 0 ? b.raisedAmount / b.goalAmount : 0;
        return pctB - pctA;
      });
    }

    return filtered;
  }, [campaigns, filter, searchQuery, currencyFilter, sortBy]);

  const totalPages = Math.ceil(filteredCampaigns.length / ITEMS_PER_PAGE);
  const paginatedCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const updateURL = (params: Record<string, string | number>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "all" && value !== "All") {
        newParams.set(key, String(value));
      } else {
        newParams.delete(key);
      }
    });
    startTransition(() => {
      router.push(`/campaigns?${newParams.toString()}`, { scroll: false });
    });
  };

  const handleFilterChange = (newFilter: CampaignFilter) => {
    updateURL({ filter: newFilter === "All" ? "" : newFilter, page: 1 });
  };

  const handleSearchChange = (value: string) => {
    updateURL({ search: value, page: 1 });
  };

  const handleCurrencyChange = (value: string) => {
    updateURL({ currency: value, page: 1 });
  };

  const handleSortChange = (value: string) => {
    updateURL({ sort: value, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    updateURL({ page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <section className="mx-auto -mt-16 max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-between gap-4 rounded-full border border-foreground/10 bg-surface p-2 pl-5"
        >
          <p className="text-sm text-foreground/60">
            {filteredCampaigns.length} campaign
            {filteredCampaigns.length !== 1 ? "s" : ""} available
          </p>
          <div className="flex gap-1 rounded-full bg-surface-muted p-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => handleFilterChange(f)}
                disabled={isPending}
                className={`rounded-full px-4 py-2 text-xs transition ${
                  filter === f
                    ? "bg-deep-green text-deep-green-foreground"
                    : "text-foreground/60 hover:text-foreground"
                } disabled:opacity-50`}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8">
          <h2 className="line-clamp-1 font-display text-2xl">
            Active Campaigns
          </h2>
          <p className="mt-1 line-clamp-2 text-sm text-foreground/60">
            Explore opportunities and back projects you believe in
          </p>
        </div>

        <div className="mb-6 space-y-4">
          {/* Search and Pagination Row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 sm:max-w-md">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
              <Input
                type="search"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                disabled={isPending}
                className="h-11 pl-10"
              />
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isPending}
                  className="border-foreground/15"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                  <span className="ml-1">Previous</span>
                </Button>
                <span className="text-sm text-foreground/60">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isPending}
                  className="border-foreground/15"
                >
                  <span className="mr-1">Next</span>
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-foreground/60">
              <FilterIcon className="h-4 w-4" />
              <span className="font-medium">Filters:</span>
            </div>

            <Select
              value={currencyFilter}
              onValueChange={handleCurrencyChange}
              disabled={isPending}
            >
              <SelectTrigger className="h-9 w-[140px] border-foreground/15">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Currencies</SelectItem>
                {currencies.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={handleSortChange}
              disabled={isPending}
            >
              <SelectTrigger className="h-9 w-[160px] border-foreground/15">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured First</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="progress">Most Funded</SelectItem>
                <SelectItem value="goal-high">Highest Goal</SelectItem>
                <SelectItem value="goal-low">Lowest Goal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {paginatedCampaigns.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-muted/30 px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              {campaigns.length === 0
                ? "No live campaigns yet. Check back soon, or create one from your dashboard."
                : "No campaigns match your search or filter."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginatedCampaigns.map((campaign, i) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                >
                  <CampaignCard
                    id={campaign.id}
                    title={campaign.title}
                    slug={campaign.slug}
                    summary={campaign.summary}
                    coverImageUrl={campaign.coverImageUrl}
                    raisedAmount={campaign.raisedAmount}
                    goalAmount={campaign.goalAmount}
                    currency={campaign.currency}
                    status={campaign.status}
                    isFeatured={campaign.isFeatured}
                  />
                </motion.div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isPending}
                  className="border-foreground/15"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                  <span className="ml-1">Previous</span>
                </Button>
                <span className="text-sm text-foreground/60">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isPending}
                  className="border-foreground/15"
                >
                  <span className="mr-1">Next</span>
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}

        <div className="mt-16 text-center">
          <Link
            href="/contact"
            className="inline-block rounded-full bg-deep-green px-6 py-3 text-sm text-deep-green-foreground transition hover:opacity-90"
          >
            Talk to an advisor
          </Link>
        </div>
      </section>
    </>
  );
}
