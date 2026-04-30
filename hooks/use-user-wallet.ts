"use client";

import { useQuery } from "@tanstack/react-query";

import { isApiSuccess } from "@/lib/http/api-result";
import { userWalletQueryKeys } from "@/lib/query-keys/user-wallet";
import { getMyWalletSnapshot } from "@/lib/services/user-wallet";

export function useUserWallet() {
  return useQuery({
    queryKey: userWalletQueryKeys.snapshot(),
    queryFn: async () => {
      const r = await getMyWalletSnapshot();
      if (!isApiSuccess(r)) {
        throw new Error(r.error?.message ?? "Failed to load wallet");
      }
      return r.data;
    },
  });
}
