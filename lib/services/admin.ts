import type { InferSelectModel } from "drizzle-orm";

import { campaigns } from "@/lib/db/schema";
import type { ApiResult } from "@/lib/http/api-result";
import { httpClient } from "@/lib/http/client";
import type {
  AdminCreateCampaignBody,
  AdminUpdateCampaignBody,
} from "@/lib/validations/admin-campaign";
import type { PaginatedResponse } from "@/types/api/admin";

export type AdminPingResponse = {
  ok: true;
  userId: string;
  role: string;
};

export async function adminPing(): Promise<AdminPingResponse> {
  const { data } = await httpClient.get<AdminPingResponse>("/admin/ping");
  return data;
}

export type AdminCampaignRow = InferSelectModel<typeof campaigns>;

export type AdminCampaignListResponse = ApiResult<PaginatedResponse<AdminCampaignRow>>;
export type AdminCampaignMutationResponse = ApiResult<AdminCampaignRow>;
export type AdminCampaignDeleteResponse = ApiResult<{ deleted: true }>;

export async function adminListCampaigns(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
}): Promise<AdminCampaignListResponse> {
  const { data } = await httpClient.get<AdminCampaignListResponse>("/admin/campaigns", {
    params,
  });
  return data;
}

export async function adminCreateCampaign(
  body: AdminCreateCampaignBody,
): Promise<AdminCampaignMutationResponse> {
  const { data } = await httpClient.post<AdminCampaignMutationResponse>(
    "/admin/campaigns",
    body,
  );
  return data;
}

export async function adminUpdateCampaign(
  id: string,
  body: AdminUpdateCampaignBody,
): Promise<AdminCampaignMutationResponse> {
  const { data } = await httpClient.patch<AdminCampaignMutationResponse>(
    `/admin/campaigns/${id}`,
    body,
  );
  return data;
}

export async function adminDeleteCampaign(
  id: string,
): Promise<AdminCampaignDeleteResponse> {
  const { data } = await httpClient.delete<AdminCampaignDeleteResponse>(
    `/admin/campaigns/${id}`,
  );
  return data;
}
