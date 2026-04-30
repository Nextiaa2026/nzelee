import type { InferSelectModel } from "drizzle-orm";

import { users } from "@/lib/db/schema";
import type { ApiResult } from "@/lib/http/api-result";
import { httpClient } from "@/lib/http/client";
import type {
  AdminKycSubmissionRow,
  AdminNotificationRow,
  AdminNotificationTarget,
  AdminPledgeListRow,
  AdminTransactionListRow,
  PaginatedResponse,
  AdminSendNotificationResult,
  AdminStatsSummary,
  AdminTimeseriesPoint,
  AdminWithdrawalListRow,
  AdminUsersListResponse,
} from "@/types/api/admin";

type TimeseriesResponse = { range: string; points: AdminTimeseriesPoint[] };
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

export async function adminListPledges(params?: {
  page?: number;
  pageSize?: number;
}): Promise<ApiResult<PaginatedResponse<AdminPledgeListRow>>> {
  const { data } = await httpClient.get<ApiResult<PaginatedResponse<AdminPledgeListRow>>>(
    "/admin/pledges",
    { params },
  );
  return data;
}

export async function adminListTransactions(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
}): Promise<ApiResult<PaginatedResponse<AdminTransactionListRow>>> {
  const { data } = await httpClient.get<ApiResult<PaginatedResponse<AdminTransactionListRow>>>(
    "/admin/transactions",
    { params },
  );
  return data;
}

export async function adminListWithdrawalRequests(params?: {
  page?: number;
  pageSize?: number;
}): Promise<ApiResult<PaginatedResponse<AdminWithdrawalListRow>>> {
  const { data } = await httpClient.get<ApiResult<PaginatedResponse<AdminWithdrawalListRow>>>(
    "/admin/withdrawal-requests",
    { params },
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

export async function adminListKycSubmissions(params?: {
  page?: number;
  pageSize?: number;
}): Promise<ApiResult<PaginatedResponse<AdminKycSubmissionRow>>> {
  const { data } = await httpClient.get<ApiResult<PaginatedResponse<AdminKycSubmissionRow>>>(
    "/admin/kyc-submissions",
    { params },
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

export async function adminListNotificationTargets(params?: {
  q?: string;
  limit?: number;
}): Promise<ApiResult<AdminNotificationTarget[]>> {
  const { data } = await httpClient.get<ApiResult<AdminNotificationTarget[]>>(
    "/admin/notification-targets",
    { params },
  );
  return data;
}

export async function adminListNotifications(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
}): Promise<ApiResult<PaginatedResponse<AdminNotificationRow>>> {
  const { data } = await httpClient.get<ApiResult<PaginatedResponse<AdminNotificationRow>>>(
    "/admin/notifications",
    { params },
  );
  return data;
}

export async function adminSendNotification(body: {
  scope: "USER" | "BROADCAST";
  userId?: string;
  type: "SYSTEM" | "KYC" | "INVESTMENT" | "WITHDRAWAL" | "GENERAL";
  title: string;
  body?: string;
  href?: string;
}): Promise<ApiResult<AdminSendNotificationResult>> {
  const { data } = await httpClient.post<ApiResult<AdminSendNotificationResult>>(
    "/admin/notifications/send",
    body,
  );
  return data;
}
