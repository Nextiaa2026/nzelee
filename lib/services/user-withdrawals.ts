import type { InferSelectModel } from "drizzle-orm";

import type { ApiResult } from "@/lib/http/api-result";
import { httpClient } from "@/lib/http/client";
import { withdrawalRequests } from "@/lib/db/schema";
import type { UserCreateWithdrawalBody } from "@/lib/validations/user-withdrawal";

export type UserWithdrawalRow = InferSelectModel<typeof withdrawalRequests>;

export async function listMyWithdrawals(): Promise<ApiResult<UserWithdrawalRow[]>> {
  const { data } = await httpClient.get<ApiResult<UserWithdrawalRow[]>>("/withdrawals");
  return data;
}

export async function createMyWithdrawal(
  body: UserCreateWithdrawalBody,
): Promise<ApiResult<UserWithdrawalRow>> {
  const { data } = await httpClient.post<ApiResult<UserWithdrawalRow>>("/withdrawals", body);
  return data;
}
