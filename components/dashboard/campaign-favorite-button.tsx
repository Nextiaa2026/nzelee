"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";

import {
  useAddCampaignFavorite,
  useMyFavoriteCampaigns,
  useRemoveCampaignFavorite,
} from "@/hooks/use-campaign-favorites";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CampaignFavoriteButtonProps = {
  campaignId: string;
  /** Where to send the user after sign-in when they tap save while logged out. */
  loginCallbackPath?: string;
  className?: string;
  size?: "default" | "sm" | "icon";
};

export function CampaignFavoriteButton({
  campaignId,
  loginCallbackPath = "/campaigns",
  className,
  size = "icon",
}: CampaignFavoriteButtonProps) {
  const { status } = useSession();
  const { data: favorites, isLoading } = useMyFavoriteCampaigns(
    status === "authenticated",
  );
  const addFavorite = useAddCampaignFavorite();
  const removeFavorite = useRemoveCampaignFavorite();

  const favorited =
    status === "authenticated" &&
    (favorites?.some((f) => f.id === campaignId) ?? false);

  const pending = addFavorite.isPending || removeFavorite.isPending;

  if (status === "unauthenticated") {
    return (
      <Button
        variant="outline"
        size={size}
        className={cn("shrink-0", className)}
        asChild
      >
        <Link
          href={`/login?callbackUrl=${encodeURIComponent(loginCallbackPath)}`}
          aria-label="Sign in to save this campaign"
        >
          <Heart className="size-4" strokeWidth={1.75} />
        </Link>
      </Button>
    );
  }

  if (status === "loading" || (status === "authenticated" && isLoading)) {
    return (
      <Button
        variant="outline"
        size={size}
        className={cn("shrink-0", className)}
        disabled
      >
        <span
          className="size-4 animate-pulse rounded-sm bg-muted"
          aria-hidden
        />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant={favorited ? "secondary" : "outline"}
      size={size}
      className={cn("shrink-0", className)}
      disabled={pending}
      aria-pressed={favorited}
      aria-label={favorited ? "Remove from saved campaigns" : "Save campaign"}
      onClick={() => {
        if (favorited) {
          removeFavorite.mutate(campaignId);
        } else {
          addFavorite.mutate(campaignId);
        }
      }}
    >
      <Heart
        className={cn("size-4", favorited && "fill-primary text-primary")}
        strokeWidth={favorited ? 0 : 1.75}
      />
    </Button>
  );
}
