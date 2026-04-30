export const userWalletQueryKeys = {
  all: ["user-wallet"] as const,
  snapshot: () => [...userWalletQueryKeys.all, "snapshot"] as const,
};
