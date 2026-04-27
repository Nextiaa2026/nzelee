import { Elysia } from "elysia";

import { apiFail, apiOk } from "../lib/http/api-result";
import { paginationQuerySchema, statsRangeQuerySchema } from "../lib/validations/admin-common";
import {
  adminCreateWithdrawalRequestBodySchema,
  adminPatchWithdrawalRequestBodySchema,
} from "../lib/validations/admin-withdrawal-request";
import { adminPatchPledgeBodySchema } from "../lib/validations/admin-pledge";
import { adminPatchUserBodySchema } from "../lib/validations/admin-users";
import {
  adminCreateRewardTierBodySchema,
  adminPatchRewardTierBodySchema,
} from "../lib/validations/admin-reward-tier";
import {
  adminCreateCampaignUpdateBodySchema,
  adminPatchCampaignUpdateBodySchema,
} from "../lib/validations/admin-campaign-update-entity";
import { getAdminStatsSummary, getAdminStatsTimeseries } from "./services/admin-stats.service";
import { getUserById, listUsers, updateUser } from "./services/admin-users.service";
import { getPledgeById, listPledges, updatePledgeStatus } from "./services/admin-pledges.service";
import {
  getPaymentTransactionById,
  listPaymentTransactions,
} from "./services/admin-transactions.service";
import {
  createWithdrawalRequest,
  deleteWithdrawalRequest,
  getWithdrawalRequestById,
  listWithdrawalRequestsWithUsers,
  updateWithdrawalRequest,
} from "./services/admin-withdrawal-requests.service";
import {
  createRewardTier,
  deleteRewardTier,
  getRewardTierById,
  listRewardTiersByCampaign,
  updateRewardTier,
} from "./services/admin-reward-tiers.service";
import {
  createCampaignUpdate,
  deleteCampaignUpdate,
  getCampaignUpdateById,
  listCampaignUpdatesByCampaign,
  updateCampaignUpdate,
} from "./services/admin-campaign-updates.service";
import { getCampaignById } from "./services/admin-campaigns.service";
import {
  createProperty,
  deleteProperty,
  getPropertyById,
  listProperties,
  updateProperty,
} from "./services/admin-properties.service";
import {
  listKycSubmissions,
  updateKycSubmissionDecision,
} from "./services/admin-kyc.service";

const v = "VALIDATION";
const nf = "NOT_FOUND";

/** Routes under `/admin` (require `requireAdminPlugin` on parent). */
export const adminExtendedRoutes = new Elysia({ name: "admin-extended" })
  .get("/stats/summary", async () => apiOk(await getAdminStatsSummary()))
  .get("/stats/timeseries", async ({ query, set }) => {
    const parsed = statsRangeQuerySchema.safeParse(query);
    if (!parsed.success) {
      set.status = 400;
      return apiFail(v, parsed.error.issues[0]?.message ?? "Invalid query");
    }
    const data = await getAdminStatsTimeseries(parsed.data.range);
    return apiOk({ range: parsed.data.range, points: data });
  })
  .get("/users", async ({ query, set }) => {
    const parsed = paginationQuerySchema.safeParse(query);
    if (!parsed.success) {
      set.status = 400;
      return apiFail(v, parsed.error.issues[0]?.message ?? "Invalid query");
    }
    const { page, pageSize, search } = parsed.data;
    const { rows, total, page: p, pageSize: ps } = await listUsers({
      page,
      pageSize,
      search,
    });
    return apiOk({ items: rows, total, page: p, pageSize: ps });
  })
  .get("/users/:id", async ({ params, set }) => {
    const row = await getUserById(params.id);
    if (!row) {
      set.status = 404;
      return apiFail(nf, "User not found");
    }
    return apiOk(row);
  })
  .patch("/users/:id", async ({ params, body, set }) => {
    const parsed = adminPatchUserBodySchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return apiFail(v, parsed.error.issues[0]?.message ?? "Invalid body");
    }
    const row = await updateUser(params.id, parsed.data);
    if (!row) {
      set.status = 404;
      return apiFail(nf, "User not found");
    }
    return apiOk(row);
  })
  .get("/pledges", async () => apiOk(await listPledges()))
  .get("/pledges/:id", async ({ params, set }) => {
    const row = await getPledgeById(params.id);
    if (!row) {
      set.status = 404;
      return apiFail(nf, "Pledge not found");
    }
    return apiOk(row);
  })
  .patch("/pledges/:id", async ({ params, body, set }) => {
    const parsed = adminPatchPledgeBodySchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return apiFail(v, parsed.error.issues[0]?.message ?? "Invalid body");
    }
    const row = await updatePledgeStatus(params.id, parsed.data.status);
    if (!row) {
      set.status = 404;
      return apiFail(nf, "Pledge not found");
    }
    return apiOk(row);
  })
  .get("/transactions", async () => apiOk(await listPaymentTransactions()))
  .get("/transactions/:id", async ({ params, set }) => {
    const row = await getPaymentTransactionById(params.id);
    if (!row) {
      set.status = 404;
      return apiFail(nf, "Transaction not found");
    }
    return apiOk(row);
  })
  .get("/withdrawal-requests", async () => apiOk(await listWithdrawalRequestsWithUsers()))
  .get("/withdrawal-requests/:id", async ({ params, set }) => {
    const row = await getWithdrawalRequestById(params.id);
    if (!row) {
      set.status = 404;
      return apiFail(nf, "Withdrawal not found");
    }
    return apiOk(row);
  })
  .post("/withdrawal-requests", async ({ body, set }) => {
    const parsed = adminCreateWithdrawalRequestBodySchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return apiFail(v, parsed.error.issues[0]?.message ?? "Invalid body");
    }
    const user = await getUserById(parsed.data.userId);
    if (!user) {
      set.status = 404;
      return apiFail(nf, "User not found");
    }
    const row = await createWithdrawalRequest(parsed.data);
    set.status = 201;
    return apiOk(row);
  })
  .patch("/withdrawal-requests/:id", async ({ params, body, set }) => {
    const parsed = adminPatchWithdrawalRequestBodySchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return apiFail(v, parsed.error.issues[0]?.message ?? "Invalid body");
    }
    const row = await updateWithdrawalRequest(params.id, parsed.data);
    if (!row) {
      set.status = 404;
      return apiFail(nf, "Withdrawal not found");
    }
    return apiOk(row);
  })
  .delete("/withdrawal-requests/:id", async ({ params, set }) => {
    const ok = await deleteWithdrawalRequest(params.id);
    if (!ok) {
      set.status = 404;
      return apiFail(nf, "Withdrawal not found");
    }
    return apiOk({ deleted: true as const });
  })
  .get("/campaigns/:campaignId/reward-tiers", async ({ params, set }) => {
    const c = await getCampaignById(params.campaignId);
    if (!c) {
      set.status = 404;
      return apiFail(nf, "Campaign not found");
    }
    return apiOk(await listRewardTiersByCampaign(params.campaignId));
  })
  .post("/campaigns/:campaignId/reward-tiers", async ({ params, body, set }) => {
    const c = await getCampaignById(params.campaignId);
    if (!c) {
      set.status = 404;
      return apiFail(nf, "Campaign not found");
    }
    const parsed = adminCreateRewardTierBodySchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return apiFail(v, parsed.error.issues[0]?.message ?? "Invalid body");
    }
    const row = await createRewardTier(params.campaignId, parsed.data);
    set.status = 201;
    return apiOk(row);
  })
  .get("/reward-tiers/:id", async ({ params, set }) => {
    const row = await getRewardTierById(params.id);
    if (!row) {
      set.status = 404;
      return apiFail(nf, "Reward tier not found");
    }
    return apiOk(row);
  })
  .patch("/reward-tiers/:id", async ({ params, body, set }) => {
    const parsed = adminPatchRewardTierBodySchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return apiFail(v, parsed.error.issues[0]?.message ?? "Invalid body");
    }
    const row = await updateRewardTier(params.id, parsed.data);
    if (!row) {
      set.status = 404;
      return apiFail(nf, "Reward tier not found");
    }
    return apiOk(row);
  })
  .delete("/reward-tiers/:id", async ({ params, set }) => {
    const ok = await deleteRewardTier(params.id);
    if (!ok) {
      set.status = 404;
      return apiFail(nf, "Reward tier not found");
    }
    return apiOk({ deleted: true as const });
  })
  .get("/campaigns/:campaignId/updates", async ({ params, set }) => {
    const c = await getCampaignById(params.campaignId);
    if (!c) {
      set.status = 404;
      return apiFail(nf, "Campaign not found");
    }
    return apiOk(await listCampaignUpdatesByCampaign(params.campaignId));
  })
  .post("/campaigns/:campaignId/updates", async ({ params, body, set }) => {
    const c = await getCampaignById(params.campaignId);
    if (!c) {
      set.status = 404;
      return apiFail(nf, "Campaign not found");
    }
    const parsed = adminCreateCampaignUpdateBodySchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return apiFail(v, parsed.error.issues[0]?.message ?? "Invalid body");
    }
    const row = await createCampaignUpdate(params.campaignId, parsed.data);
    set.status = 201;
    return apiOk(row);
  })
  .get("/campaign-updates/:id", async ({ params, set }) => {
    const row = await getCampaignUpdateById(params.id);
    if (!row) {
      set.status = 404;
      return apiFail(nf, "Update not found");
    }
    return apiOk(row);
  })
  .patch("/campaign-updates/:id", async ({ params, body, set }) => {
    const parsed = adminPatchCampaignUpdateBodySchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return apiFail(v, parsed.error.issues[0]?.message ?? "Invalid body");
    }
    const row = await updateCampaignUpdate(params.id, parsed.data);
    if (!row) {
      set.status = 404;
      return apiFail(nf, "Update not found");
    }
    return apiOk(row);
  })
  .delete("/campaign-updates/:id", async ({ params, set }) => {
    const ok = await deleteCampaignUpdate(params.id);
    if (!ok) {
      set.status = 404;
      return apiFail(nf, "Update not found");
    }
    return apiOk({ deleted: true as const });
  })
  .get("/properties", async () => apiOk(await listProperties()))
  .get("/properties/:id", async ({ params, set }) => {
    const row = await getPropertyById(params.id);
    if (!row) {
      set.status = 404;
      return apiFail(nf, "Property not found");
    }
    return apiOk(row);
  })
  .post("/properties", async ({ body, admin, set }) => {
    const b = body as Record<string, unknown>;
    if (typeof b.name !== "string" || b.name.trim().length === 0) {
      set.status = 400;
      return apiFail(v, "Property name is required");
    }
    if (typeof b.country !== "string" || b.country.trim().length < 2) {
      set.status = 400;
      return apiFail(v, "Country is required");
    }
    const row = await createProperty(admin!.id, {
      slug: typeof b.slug === "string" ? b.slug : undefined,
      name: b.name,
      description: typeof b.description === "string" ? b.description : null,
      type: typeof b.type === "string" ? (b.type as Parameters<typeof createProperty>[1]["type"]) : undefined,
      status: typeof b.status === "string" ? (b.status as Parameters<typeof createProperty>[1]["status"]) : undefined,
      country: b.country,
      city: typeof b.city === "string" ? b.city : null,
      coverImageUrl: typeof b.coverImageUrl === "string" ? b.coverImageUrl : null,
      appraisedValue: typeof b.appraisedValue === "number" ? b.appraisedValue : null,
      currency: typeof b.currency === "string" ? b.currency : undefined,
    });
    set.status = 201;
    return apiOk(row);
  })
  .patch("/properties/:id", async ({ params, body, set }) => {
    const b = body as Record<string, unknown>;
    const row = await updateProperty(params.id, {
      slug: typeof b.slug === "string" ? b.slug : undefined,
      name: typeof b.name === "string" ? b.name : undefined,
      description:
        typeof b.description === "string"
          ? b.description
          : b.description === null
            ? null
            : undefined,
      type: typeof b.type === "string" ? (b.type as Parameters<typeof updateProperty>[1]["type"]) : undefined,
      status:
        typeof b.status === "string"
          ? (b.status as Parameters<typeof updateProperty>[1]["status"])
          : undefined,
      country: typeof b.country === "string" ? b.country : undefined,
      city:
        typeof b.city === "string"
          ? b.city
          : b.city === null
            ? null
            : undefined,
      coverImageUrl:
        typeof b.coverImageUrl === "string"
          ? b.coverImageUrl
          : b.coverImageUrl === null
            ? null
            : undefined,
      appraisedValue:
        typeof b.appraisedValue === "number"
          ? b.appraisedValue
          : b.appraisedValue === null
            ? null
            : undefined,
      currency: typeof b.currency === "string" ? b.currency : undefined,
    });
    if (!row) {
      set.status = 404;
      return apiFail(nf, "Property not found");
    }
    return apiOk(row);
  })
  .delete("/properties/:id", async ({ params, set }) => {
    const ok = await deleteProperty(params.id);
    if (!ok) {
      set.status = 404;
      return apiFail(nf, "Property not found");
    }
    return apiOk({ deleted: true as const });
  })
  .get("/kyc-submissions", async () => apiOk(await listKycSubmissions()))
  .patch("/kyc-submissions/:id", async ({ params, body, admin, set }) => {
    const b = body as Record<string, unknown>;
    if (typeof b.status !== "string") {
      set.status = 400;
      return apiFail(v, "status is required");
    }
    const allowed = new Set(["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED", "EXPIRED"]);
    if (!allowed.has(b.status)) {
      set.status = 400;
      return apiFail(v, "Invalid status");
    }
    const row = await updateKycSubmissionDecision({
      id: params.id,
      reviewerUserId: admin!.id,
      status: b.status as "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "EXPIRED",
      rejectionReason: typeof b.rejectionReason === "string" ? b.rejectionReason : null,
    });
    if (!row) {
      set.status = 404;
      return apiFail(nf, "KYC submission not found");
    }
    return apiOk(row);
  });
