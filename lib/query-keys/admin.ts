export const adminQueryKeys = {
  all: ["admin"] as const,
  stats: {
    summary: () => [...adminQueryKeys.all, "stats", "summary"] as const,
    timeseries: (range: string) =>
      [...adminQueryKeys.all, "stats", "timeseries", range] as const,
  },
  users: (page: number, pageSize: number, search: string) =>
    [...adminQueryKeys.all, "users", { page, pageSize, search }] as const,
  pledges: () => [...adminQueryKeys.all, "pledges"] as const,
  transactions: () => [...adminQueryKeys.all, "transactions"] as const,
  withdrawalRequests: () => [...adminQueryKeys.all, "withdrawal-requests"] as const,
  kycSubmissions: () => [...adminQueryKeys.all, "kyc-submissions"] as const,
  notificationTargets: (q: string, limit: number) =>
    [...adminQueryKeys.all, "notification-targets", { q, limit }] as const,
  notifications: (page: number, pageSize: number, search: string) =>
    [...adminQueryKeys.all, "notifications", { page, pageSize, search }] as const,
} as const;

export const userInvestmentQueryKeys = {
  list: () => ["user", "investments"] as const,
} as const;
