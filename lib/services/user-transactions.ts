import type { ApiResult } from "@/lib/http/api-result";
import { httpClient } from "@/lib/http/client";

export interface UserTransaction {
  id: string;
  amount: number;
  type: string;
  status: string;
  createdAt: string | Date;
  campaignTitle: string | null;
}

export async function listMyTransactions(): Promise<ApiResult<UserTransaction[]>> {
  const { data } = await httpClient.get<ApiResult<UserTransaction[]>>("/transactions");
  return data;
}
