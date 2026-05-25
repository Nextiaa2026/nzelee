"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useMemo, useState, useTransition } from "react";
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
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [filter, setFilter] = useState<CampaignFilter>(
    initialFilter as CampaignFilter,
  );
  const [currencyFilter, setCurrencyFilter] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [isPending, startTransition] = useTransition();

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

  const handleFilterChange = (newFilter: CampaignFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleCurrencyChange = (value: string) => {
    setCurrencyFilter(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
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
          {/* <p className="text-sm text-foreground/60">
            {filteredCampaigns.length} campagne
            {filteredCampaigns.length > 1 ? "s" : ""} disponible
            {filteredCampaigns.length > 1 ? "s" : ""}
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
          </div> */}
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8">
          <h2 className="line-clamp-1 font-display text-2xl">
            Campagnes actives
          </h2>
          <p className="mt-1 line-clamp-2 text-sm text-foreground/60">
            Explorez les opportunités et soutenez les projets auxquels vous croyez
          </p>
        </div>

        <div className="mb-6 space-y-4">
          {/* Search and Pagination Row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 sm:max-w-md">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
              <Input
                type="search"
                placeholder="Rechercher des campagnes..."
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
                  <span className="ml-1">Précédent</span>
                </Button>
                <span className="text-sm text-foreground/60">
                  Page {currentPage} sur {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isPending}
                  className="border-foreground/15"
                >
                  <span className="mr-1">Suivant</span>
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-foreground/60">
              <FilterIcon className="h-4 w-4" />
              <span className="font-medium">Filtres:</span>
            </div>

            <Select
              value={currencyFilter}
              onValueChange={handleCurrencyChange}
              disabled={isPending}
            >
              <SelectTrigger className="h-9 w-[140px] border-foreground/15">
                <SelectValue placeholder="Devise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les devises</SelectItem>
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
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">En vedette d&apos;abord</SelectItem>
                <SelectItem value="newest">Plus récent d&apos;abord</SelectItem>
                <SelectItem value="progress">Plus financé</SelectItem>
                <SelectItem value="goal-high">Objectif le plus élevé</SelectItem>
                <SelectItem value="goal-low">Objectif le plus bas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {paginatedCampaigns.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-muted/30 px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              {campaigns.length === 0
                ? "Aucune campagne en direct pour le moment. Revenez bientôt ou créez-en une depuis votre tableau de bord."
                : "Aucune campagne ne correspond à votre recherche ou à vos filtres."}
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
                  <span className="ml-1">Précédent</span>
                </Button>
                <span className="text-sm text-foreground/60">
                  Page {currentPage} sur {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isPending}
                  className="border-foreground/15"
                >
                  <span className="mr-1">Suivant</span>
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
            Parler à un conseiller
          </Link>
        </div>
      </section>
    </>
  );
}
