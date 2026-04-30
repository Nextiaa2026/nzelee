export const userWithdrawalsQueryKeys = {
  all: ["user", "withdrawals"] as const,
  list: () => [...userWithdrawalsQueryKeys.all, "list"] as const,
};
