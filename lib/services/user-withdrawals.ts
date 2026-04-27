import type { InferSelectModel } from "drizzle-orm";

import { withdrawalRequests } from "@/lib/db/schema";
import type { ApiResult } from "@/lib/http/api-result";
import { httpClient } from "@/lib/http/client";
import type { UserCreateWithdrawalBody } from "@/lib/validations/user-withdrawal";

type WrRow = InferSelectModel<typeof withdrawalRequests>;

export async function listMyWithdrawals(): Promise<ApiResult<WrRow[]>> {
  const { data } = await httpClient.get<ApiResult<WrRow[]>>("/withdrawals");
  return data;
}

export async function createMyWithdrawal(
  body: UserCreateWithdrawalBody,
): Promise<ApiResult<WrRow>> {
  const { data } = await httpClient.post<ApiResult<WrRow>>("/withdrawals", body);
  return data;
}
