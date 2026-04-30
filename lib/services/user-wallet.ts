import type { ApiResult } from "@/lib/http/api-result";
import { httpClient } from "@/lib/http/client";

import type { UserWalletSnapshot } from "./user-wallet-snapshot";

export type { UserWalletSnapshot };

export async function getMyWalletSnapshot(): Promise<ApiResult<UserWalletSnapshot>> {
  const { data } = await httpClient.get<ApiResult<UserWalletSnapshot>>("/wallet");
  return data;
}
