"use client";

import { useQuery } from "@tanstack/react-query";
import { isApiSuccess } from "@/lib/http/api-result";
import { userQueryKeys } from "@/lib/query-keys/user";
import { listMyTransactions } from "@/lib/services/user-transactions";

export function useMyTransactions() {
  return useQuery({
    queryKey: userQueryKeys.transactions(),
    queryFn: async () => {
      const r = await listMyTransactions();
      if (!isApiSuccess(r)) {
        throw new Error(r.error?.message ?? "Failed to load transactions");
      }
      return r.data;
    },
  });
}
