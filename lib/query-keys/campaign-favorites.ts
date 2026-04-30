export const campaignFavoriteKeys = {
  all: ["campaign-favorites"] as const,
  list: () => [...campaignFavoriteKeys.all, "list"] as const,
};
