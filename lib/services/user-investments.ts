import type { InferSelectModel } from "drizzle-orm";

import { campaigns, pledges } from "@/lib/db/schema";
import type { ApiResult } from "@/lib/http/api-result";
import { httpClient } from "@/lib/http/client";
import type { UserCreateInvestmentBody } from "@/lib/validations/user-investment";

type PledgeRow = InferSelectModel<typeof pledges>;
type CampaignRow = InferSelectModel<typeof campaigns>;

export type UserInvestmentListRow = Pick<
  PledgeRow,
  "id" | "campaignId" | "amount" | "status" | "createdAt"
> & {
  campaignTitle: CampaignRow["title"];
  campaignSlug: CampaignRow["slug"];
  currency: CampaignRow["currency"];
};

export async function listMyInvestments(): Promise<ApiResult<UserInvestmentListRow[]>> {
  const { data } = await httpClient.get<ApiResult<UserInvestmentListRow[]>>("/investments");
  return data;
}

export async function createMyInvestment(
  body: UserCreateInvestmentBody,
): Promise<ApiResult<PledgeRow>> {
  const { data } = await httpClient.post<ApiResult<PledgeRow>>("/investments", body);
  return data;
}
