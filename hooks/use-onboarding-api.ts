import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface CompleteOnboardingParams {
  displayName: string;
  country: string;
  dateOfBirth: string;
  currency: string;
}

export function useCompleteOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CompleteOnboardingParams) => {
      const response = await fetch("/api/v1/onboarding/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to complete onboarding");
      }

      return result.data;
    },
    onSuccess: () => {
      // Invalidate user and onboarding queries
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding"] });
    },
  });
}
