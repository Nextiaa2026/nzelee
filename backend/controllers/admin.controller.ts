import { Elysia } from "elysia";

import { adminExtendedRoutes } from "../admin-extended";
import { apiFail, apiOk } from "../../lib/http/api-result";
import {
  adminCreateCampaignBodySchema,
  adminUpdateCampaignBodySchema,
} from "../../lib/validations/admin-campaign";
import { requireAdminPlugin } from "../plugins/admin-auth.plugin";
import {
  createCampaign,
  deleteCampaign,
  getCampaignById,
  listCampaigns,
  updateCampaign,
} from "../services/admin-campaigns.service";

const validationCode = "VALIDATION";
const notFoundCode = "NOT_FOUND";

/**
 * Private admin API — cookie session must carry role **ADMIN** (NextAuth JWT).
 * Example: `GET /api/v1/admin/ping` while logged in as admin in the same browser.
 */
export const adminController = new Elysia({ prefix: "/admin" })
  .use(requireAdminPlugin)
  .get("/ping", ({ admin }) => {
    const a = admin!;
    return {
      ok: true,
      userId: a.id,
      role: a.role,
    };
  })
  .use(adminExtendedRoutes)
  .get("/campaigns", async () => {
    const rows = await listCampaigns();
    return apiOk(rows);
  })
  .get("/campaigns/:id", async ({ params, set }) => {
    const row = await getCampaignById(params.id);
    if (!row) {
      set.status = 404;
      return apiFail(notFoundCode, "Campaign not found");
    }
    return apiOk(row);
  })
  .post("/campaigns", async ({ body, admin, set }) => {
    const parsed = adminCreateCampaignBodySchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return apiFail(
        validationCode,
        parsed.error.issues[0]?.message ?? "Invalid request body",
      );
    }
    try {
      const row = await createCampaign(admin!.id, parsed.data);
      set.status = 201;
      return apiOk(row);
    } catch (e) {
      set.status = 500;
      return apiFail(
        "SERVER",
        e instanceof Error ? e.message : "Failed to create campaign",
      );
    }
  })
  .patch("/campaigns/:id", async ({ params, body, set }) => {
    const parsed = adminUpdateCampaignBodySchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return apiFail(
        validationCode,
        parsed.error.issues[0]?.message ?? "Invalid request body",
      );
    }
    const row = await updateCampaign(params.id, parsed.data);
    if (!row) {
      set.status = 404;
      return apiFail(notFoundCode, "Campaign not found");
    }
    return apiOk(row);
  })
  .delete("/campaigns/:id", async ({ params, set }) => {
    const ok = await deleteCampaign(params.id);
    if (!ok) {
      set.status = 404;
      return apiFail(notFoundCode, "Campaign not found");
    }
    return apiOk({ deleted: true as const });
  });
