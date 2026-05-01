export const userQueryKeys = {
  all: ["user"] as const,
  profile: () => [...userQueryKeys.all, "profile"] as const,
  summary: () => [...userQueryKeys.all, "summary"] as const,
  transactions: () => [...userQueryKeys.all, "transactions"] as const,
};
