import type { ApiResult } from "@/lib/http/api-result";
import { httpClient } from "@/lib/http/client";

export interface UserAccountSummary {
  campaigns: number;
  investments: number;
  investedAmount: number;
  unreadNotifications: number;
  pendingWithdrawals: number;
}

export async function getMyAccountSummary(): Promise<ApiResult<UserAccountSummary>> {
  const { data } = await httpClient.get<ApiResult<UserAccountSummary>>("/summary");
  return data;
}
