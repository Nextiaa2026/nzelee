"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { campaignFavoriteKeys } from "@/lib/query-keys/campaign-favorites";

export interface FavoriteCampaign {
  id: string;
  title: string;
  slug: string;
  summary: string;
  status: string;
  goalAmount: number;
  raisedAmount: number;
  currency: string;
  coverImageUrl: string | null;
  createdAt: Date;
}

export function useMyFavoriteCampaigns(enabled = true) {
  return useQuery({
    queryKey: campaignFavoriteKeys.list(),
    queryFn: async (): Promise<FavoriteCampaign[]> => {
      const response = await fetch("/api/v1/favorites", {
        credentials: "include",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch favorites");
      }

      return result.data;
    },
    enabled,
  });
}

export function useAddCampaignFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (campaignId: string) => {
      const response = await fetch("/api/v1/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ campaignId }),
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add favorite");
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("Saved to your list");
      void qc.invalidateQueries({ queryKey: campaignFavoriteKeys.list() });
      void qc.invalidateQueries({ queryKey: ["campaigns"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not save campaign.");
    },
  });
}

export function useRemoveCampaignFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (campaignId: string) => {
      const response = await fetch(`/api/v1/favorites/${campaignId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to remove favorite");
      }

      return result.data;
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: campaignFavoriteKeys.list() });
      void qc.invalidateQueries({ queryKey: ["campaigns"] });
    },
    onError: () => {
      toast.error("Could not remove saved campaign.");
    },
  });
}
