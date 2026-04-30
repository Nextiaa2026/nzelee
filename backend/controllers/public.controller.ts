import { Elysia } from "elysia";

import { apiFail, apiOk } from "../../lib/http/api-result";
import { listBrowseableCampaigns } from "../../lib/services/public-campaigns";

export const publicController = new Elysia({ prefix: "/public" }).get(
  "/campaigns",
  async ({ set }) => {
    try {
      return apiOk(await listBrowseableCampaigns());
    } catch {
      set.status = 500;
      return apiFail("SERVER", "Failed to load campaigns");
    }
  },
);
