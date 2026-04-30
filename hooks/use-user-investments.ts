"use client";

import { useQuery } from "@tanstack/react-query";

import { isApiSuccess } from "@/lib/http/api-result";
import { userInvestmentQueryKeys } from "@/lib/query-keys/admin";
import { listMyInvestments } from "@/lib/services/user-investments";

export function useUserInvestments() {
  return useQuery({
    queryKey: userInvestmentQueryKeys.list(),
    queryFn: async () => {
      const r = await listMyInvestments();
      if (!isApiSuccess(r)) {
        throw new Error(r.error?.message ?? "Failed to load investments");
      }
      return r.data;
    },
  });
}
