import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userQueryKeys } from "@/lib/query-keys/user";

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
      // Invalidate all user-related queries
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
    },
  });
}
