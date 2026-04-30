import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

export function useFavorites() {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: async (): Promise<FavoriteCampaign[]> => {
      const response = await fetch("/api/v1/favorites");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch favorites");
      }

      return result.data;
    },
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (campaignId: string) => {
      const response = await fetch("/api/v1/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ campaignId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add favorite");
      }

      return result.data;
    },
    onSuccess: () => {
      // Invalidate favorites and campaigns
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (campaignId: string) => {
      const response = await fetch(`/api/v1/favorites/${campaignId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to remove favorite");
      }

      return result.data;
    },
    onSuccess: () => {
      // Invalidate favorites and campaigns
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}
