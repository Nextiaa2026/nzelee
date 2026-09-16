import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { z } from "zod";

import { userQueryKeys } from "@/lib/query-keys/user";
import { profileSettingsSchema } from "@/lib/validations/marketing-forms";

export type UpdateProfileParams = z.infer<typeof profileSettingsSchema>;

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
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
    },
  });
}
