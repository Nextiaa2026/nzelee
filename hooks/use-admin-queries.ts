"use client";

import { useQuery } from "@tanstack/react-query";

import { isApiSuccess } from "@/lib/http/api-result";
import { adminQueryKeys } from "@/lib/query-keys/admin";
import {
  adminListNotificationTargets,
  adminListNotifications,
  adminGetStatsSummary,
  adminGetStatsTimeseries,
  adminListPledges,
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

export function useAdminPledges(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: [...adminQueryKeys.pledges(), { page, pageSize }],
    queryFn: async () =>
      unwrap(await adminListPledges({ page, pageSize }), "Failed to load pledges"),
  });
}

export function useAdminTransactions(
  page = 1,
  pageSize = 20,
  search = "",
  startDate = "",
  endDate = "",
) {
  return useQuery({
    queryKey: [...adminQueryKeys.transactions(), { page, pageSize, search, startDate, endDate }],
    queryFn: async () =>
      unwrap(
        await adminListTransactions({
          page,
          pageSize,
          search: search || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        }),
        "Failed to load transactions",
      ),
  });
}


export function useAdminWithdrawalRequests(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: [...adminQueryKeys.withdrawalRequests(), { page, pageSize }],
    queryFn: async () =>
      unwrap(
        await adminListWithdrawalRequests({ page, pageSize }),
        "Failed to load withdrawals",
      ),
  });
}

export function useAdminKycSubmissions(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: [...adminQueryKeys.kycSubmissions(), { page, pageSize }],
    queryFn: async () =>
      unwrap(
        await adminListKycSubmissions({ page, pageSize }),
        "Failed to load KYC submissions",
      ),
  });
}

export function useAdminNotificationTargets(q = "", limit = 25) {
  return useQuery({
    queryKey: adminQueryKeys.notificationTargets(q, limit),
    queryFn: async () =>
      unwrap(
        await adminListNotificationTargets({
          q: q.trim() || undefined,
          limit,
        }),
        "Failed to load users",
      ),
  });
}

export function useAdminNotifications(page = 1, pageSize = 20, search = "") {
  return useQuery({
    queryKey: adminQueryKeys.notifications(page, pageSize, search),
    queryFn: async () =>
      unwrap(
        await adminListNotifications({ page, pageSize, search: search || undefined }),
        "Failed to load notifications",
      ),
  });
}
