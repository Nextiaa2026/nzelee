import type { InferSelectModel } from "drizzle-orm";

import { paymentTransactions, users } from "@/lib/db/schema";
import type { ApiResult } from "@/lib/http/api-result";
import { httpClient } from "@/lib/http/client";
import type {
  AdminKycSubmissionRow,
  AdminPropertyListRow,
  AdminPledgeListRow,
  AdminStatsSummary,
  AdminTimeseriesPoint,
  AdminWithdrawalListRow,
  AdminUsersListResponse,
} from "@/types/api/admin";

type TimeseriesResponse = { range: string; points: AdminTimeseriesPoint[] };
type TxRow = InferSelectModel<typeof paymentTransactions>;
type UserRow = InferSelectModel<typeof users>;

export async function adminGetStatsSummary(): Promise<ApiResult<AdminStatsSummary>> {
  const { data } = await httpClient.get<ApiResult<AdminStatsSummary>>(
    "/admin/stats/summary",
  );
  return data;
}

export async function adminGetStatsTimeseries(
  range: "30d" | "90d" | "6m" | "1y" = "90d",
): Promise<ApiResult<TimeseriesResponse>> {
  const { data } = await httpClient.get<ApiResult<TimeseriesResponse>>(
    "/admin/stats/timeseries",
    { params: { range } },
  );
  return data;
}

export async function adminListUsersQuery(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
}): Promise<ApiResult<AdminUsersListResponse>> {
  const { data } = await httpClient.get<ApiResult<AdminUsersListResponse>>(
    "/admin/users",
    { params },
  );
  return data;
}

export async function adminListPledges(): Promise<ApiResult<AdminPledgeListRow[]>> {
  const { data } = await httpClient.get<ApiResult<AdminPledgeListRow[]>>(
    "/admin/pledges",
  );
  return data;
}

export async function adminListTransactions(): Promise<ApiResult<TxRow[]>> {
  const { data } = await httpClient.get<ApiResult<TxRow[]>>("/admin/transactions");
  return data;
}

export async function adminListWithdrawalRequests(): Promise<
  ApiResult<AdminWithdrawalListRow[]>
> {
  const { data } = await httpClient.get<ApiResult<AdminWithdrawalListRow[]>>(
    "/admin/withdrawal-requests",
  );
  return data;
}

export async function adminPatchPledgeStatus(
  id: string,
  body: { status: "PENDING" | "PAID" | "FAILED" | "REFUNDED" },
): Promise<ApiResult<AdminPledgeListRow>> {
  const { data } = await httpClient.patch<ApiResult<AdminPledgeListRow>>(
    `/admin/pledges/${id}`,
    body,
  );
  return data;
}

export async function adminPatchUser(
  id: string,
  body: { name?: string; role?: "USER" | "CREATOR" | "ADMIN" },
): Promise<ApiResult<UserRow>> {
  const { data } = await httpClient.patch<ApiResult<UserRow>>(
    `/admin/users/${id}`,
    body,
  );
  return data;
}

export async function adminDeleteWithdrawalRequest(
  id: string,
): Promise<ApiResult<{ deleted: true }>> {
  const { data } = await httpClient.delete<ApiResult<{ deleted: true }>>(
    `/admin/withdrawal-requests/${id}`,
  );
  return data;
}

export async function adminPatchWithdrawalRequest(
  id: string,
  body: {
    status?: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "CANCELLED";
    adminNote?: string | null;
    destination?: string;
    processedAt?: string | null;
    completedAt?: string | null;
  },
): Promise<ApiResult<AdminWithdrawalListRow>> {
  const { data } = await httpClient.patch<ApiResult<AdminWithdrawalListRow>>(
    `/admin/withdrawal-requests/${id}`,
    body,
  );
  return data;
}

export async function adminListProperties(): Promise<ApiResult<AdminPropertyListRow[]>> {
  const { data } = await httpClient.get<ApiResult<AdminPropertyListRow[]>>(
    "/admin/properties",
  );
  return data;
}

export async function adminCreateProperty(
  body: Partial<AdminPropertyListRow> & { name: string; country: string },
): Promise<ApiResult<AdminPropertyListRow>> {
  const { data } = await httpClient.post<ApiResult<AdminPropertyListRow>>(
    "/admin/properties",
    body,
  );
  return data;
}

export async function adminPatchProperty(
  id: string,
  body: Partial<AdminPropertyListRow>,
): Promise<ApiResult<AdminPropertyListRow>> {
  const { data } = await httpClient.patch<ApiResult<AdminPropertyListRow>>(
    `/admin/properties/${id}`,
    body,
  );
  return data;
}

export async function adminDeleteProperty(
  id: string,
): Promise<ApiResult<{ deleted: true }>> {
  const { data } = await httpClient.delete<ApiResult<{ deleted: true }>>(
    `/admin/properties/${id}`,
  );
  return data;
}

export async function adminListKycSubmissions(): Promise<
  ApiResult<AdminKycSubmissionRow[]>
> {
  const { data } = await httpClient.get<ApiResult<AdminKycSubmissionRow[]>>(
    "/admin/kyc-submissions",
  );
  return data;
}

export async function adminPatchKycSubmission(
  id: string,
  body: {
    status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "EXPIRED";
    rejectionReason?: string | null;
  },
): Promise<ApiResult<AdminKycSubmissionRow>> {
  const { data } = await httpClient.patch<ApiResult<AdminKycSubmissionRow>>(
    `/admin/kyc-submissions/${id}`,
    body,
  );
  return data;
}
