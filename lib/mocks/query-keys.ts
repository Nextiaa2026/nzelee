export const mockQueryKeys = {
  admin: {
    users: ["mock", "admin", "users"] as const,
    campaigns: ["mock", "admin", "campaigns"] as const,
    investments: ["mock", "admin", "investments"] as const,
    transactions: ["mock", "admin", "transactions"] as const,
    withdrawals: ["mock", "admin", "withdrawals"] as const,
  },
  investor: {
    transactions: ["mock", "investor", "transactions"] as const,
    investments: ["mock", "investor", "investments"] as const,
    withdrawals: ["mock", "investor", "withdrawals"] as const,
  },
} as const;
