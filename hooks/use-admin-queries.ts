"use client";

import { useQuery } from "@tanstack/react-query";

import { isApiSuccess } from "@/lib/http/api-result";
import { adminQueryKeys } from "@/lib/query-keys/admin";
import {
  adminGetStatsSummary,
  adminGetStatsTimeseries,
  adminListPledges,
  adminListProperties,
  adminListTransactions,
  adminListUsersQuery,
  adminListWithdrawalRequests,
  adminListKycSubmissions,
} from "@/lib/services/admin-rest";

function unwrap<T>(r: import("@/lib/http/api-result").ApiResult<T>, label: string): T {
  if (!isApiSuccess(r)) {
    throw new Error(r.error?.message ?? label);
  }
  return r.data;
}

export function useAdminStatsSummary() {
  return useQuery({
    queryKey: adminQueryKeys.stats.summary(),
    queryFn: async () => unwrap(await adminGetStatsSummary(), "Failed to load stats"),
  });
}

export function useAdminStatsTimeseries(range: "30d" | "90d" | "6m" | "1y" = "90d") {
  return useQuery({
    queryKey: adminQueryKeys.stats.timeseries(range),
    queryFn: async () => unwrap(await adminGetStatsTimeseries(range), "Failed to load series"),
  });
}

export function useAdminUsers(
  page = 1,
  pageSize = 20,
  search = "",
) {
  return useQuery({
    queryKey: adminQueryKeys.users(page, pageSize, search),
    queryFn: async () =>
      unwrap(
        await adminListUsersQuery({ page, pageSize, search: search || undefined }),
        "Failed to load users",
      ),
  });
}

export function useAdminPledges() {
  return useQuery({
    queryKey: adminQueryKeys.pledges(),
    queryFn: async () => unwrap(await adminListPledges(), "Failed to load pledges"),
  });
}

export function useAdminTransactions() {
  return useQuery({
    queryKey: adminQueryKeys.transactions(),
    queryFn: async () =>
      unwrap(await adminListTransactions(), "Failed to load transactions"),
  });
}

export function useAdminWithdrawalRequests() {
  return useQuery({
    queryKey: adminQueryKeys.withdrawalRequests(),
    queryFn: async () =>
      unwrap(await adminListWithdrawalRequests(), "Failed to load withdrawals"),
  });
}

export function useAdminProperties() {
  return useQuery({
    queryKey: adminQueryKeys.properties(),
    queryFn: async () => unwrap(await adminListProperties(), "Failed to load properties"),
  });
}

export function useAdminKycSubmissions() {
  return useQuery({
    queryKey: adminQueryKeys.kycSubmissions(),
    queryFn: async () =>
      unwrap(await adminListKycSubmissions(), "Failed to load KYC submissions"),
  });
}
