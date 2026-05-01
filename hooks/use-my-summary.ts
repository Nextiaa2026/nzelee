"use client";

import { useQuery } from "@tanstack/react-query";
import { isApiSuccess } from "@/lib/http/api-result";
import { userQueryKeys } from "@/lib/query-keys/user";
import { getMyAccountSummary } from "@/lib/services/user-summary";

export function useMySummary() {
  return useQuery({
    queryKey: userQueryKeys.summary(),
    queryFn: async () => {
      const r = await getMyAccountSummary();
      if (!isApiSuccess(r)) {
        throw new Error(r.error?.message ?? "Failed to load summary");
      }
      return r.data;
    },
  });
}
