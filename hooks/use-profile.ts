import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface UpdateProfileParams {
  displayName: string;
  organization?: string;
  country?: string;
  dateOfBirth?: string;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileParams) => {
      const response = await fetch("/api/v1/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update profile");
      }

      return result.data;
    },
    onSuccess: () => {
      // Invalidate profile and user queries
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}
