import { useQuery } from "@tanstack/react-query";

import { isApiSuccess } from "@/lib/http/api-result";
import { userWithdrawalsQueryKeys } from "@/lib/query-keys/user-withdrawals";
import { listMyWithdrawals } from "@/lib/services/user-withdrawals";

export function useUserWithdrawals() {
  return useQuery({
    queryKey: userWithdrawalsQueryKeys.list(),
    queryFn: async () => {
      const res = await listMyWithdrawals();
      if (!isApiSuccess(res)) {
        throw new Error(res.error.message);
      }
      return res.data;
    },
  });
}
