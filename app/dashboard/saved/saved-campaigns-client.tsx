"use client";

import Link from "next/link";
import { CampaignCard } from "@/components/campaigns/campaign-card";
import { CampaignFavoriteButton } from "@/components/dashboard/campaign-favorite-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMyFavoriteCampaigns } from "@/hooks/use-campaign-favorites";

export function SavedCampaignsClient() {
  const {
    data: rows = [],
    isLoading,
    isError,
    refetch,
  } = useMyFavoriteCampaigns(true);

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="aspect-[16/10] animate-pulse rounded-[1.75rem] bg-muted"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="rounded-[1.75rem] border-black/5 shadow-sm">
        <CardHeader>
          <CardTitle>Could not load saved campaigns</CardTitle>
          <CardDescription>Try again in a moment.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={() => void refetch()}
            className="rounded-xl"
          >
            Retry
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (!rows.length) {
    return (
      <Card className="rounded-[1.75rem] border-black/5 shadow-sm">
        <CardHeader>
          <CardTitle>No saved campaigns yet</CardTitle>
          <CardDescription>
            Browse live listings and tap the heart to keep them here for quick
            access.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            asChild
            className="rounded-xl bg-deep-green hover:bg-deep-green/90"
          >
            <Link href="/dashboard/markets">Browse campaigns</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((row) => (
        <div key={row.id} className="relative">
          <CampaignCard
            id={row.id}
            title={row.title}
            slug={row.slug}
            summary={row.summary}
            coverImageUrl={row.coverImageUrl}
            raisedAmount={row.raisedAmount}
            goalAmount={row.goalAmount}
            currency={row.currency}
            status={row.status}
          />
          <div className="absolute right-4 top-4 z-10">
            <CampaignFavoriteButton
              campaignId={row.id}
              loginCallbackPath="/dashboard/saved"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
