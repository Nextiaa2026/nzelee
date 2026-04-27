"use client";

import { useQuery } from "@tanstack/react-query";

import { isApiSuccess } from "@/lib/http/api-result";
import { userWithdrawalQueryKeys } from "@/lib/query-keys/admin";
import { listMyWithdrawals } from "@/lib/services/user-withdrawals";

export function useUserWithdrawals() {
  return useQuery({
    queryKey: userWithdrawalQueryKeys.list(),
    queryFn: async () => {
      const r = await listMyWithdrawals();
      if (!isApiSuccess(r)) {
        throw new Error(r.error?.message ?? "Failed to load withdrawals");
      }
      return r.data;
    },
  });
}
