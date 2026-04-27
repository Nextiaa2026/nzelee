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
  properties: () => [...adminQueryKeys.all, "properties"] as const,
  kycSubmissions: () => [...adminQueryKeys.all, "kyc-submissions"] as const,
} as const;

export const userWithdrawalQueryKeys = {
  list: () => ["user", "withdrawals"] as const,
} as const;
