import { Elysia } from "elysia";

import { apiFail, apiOk } from "../../lib/http/api-result";
import { listBrowseableCampaigns } from "../../lib/services/public-campaigns";
import { getStructuredDataStats } from "../../lib/services/structured-data";

export const publicController = new Elysia({ prefix: "/public" })
  .get("/campaigns", async ({ set }) => {
    try {
      return apiOk(await listBrowseableCampaigns());
    } catch {
      set.status = 500;
      return apiFail("SERVER", "Failed to load campaigns");
    }
  })
  .get("/platform-stats", async ({ set }) => {
    try {
      const stats = await getStructuredDataStats();
      return apiOk(stats);
    } catch (error) {
      console.error("Error fetching platform stats:", error);
      set.status = 500;
      return apiFail("SERVER", "Failed to load platform statistics");
    }
  });
