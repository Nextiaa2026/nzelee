import { Elysia } from "elysia";

import { apiFail, apiOk } from "../../lib/http/api-result";
import {
  executeImageDelete,
  executeImageUpload,
} from "../../lib/services/image-upload";
import {
  paginationQuerySchema,
  statsRangeQuerySchema,
} from "../../lib/validations/admin-common";
import {
  adminCreateWithdrawalRequestBodySchema,
  adminPatchWithdrawalRequestBodySchema,
} from "../../lib/validations/admin-withdrawal-request";
import { adminPatchPledgeBodySchema } from "../../lib/validations/admin-pledge";
import { adminPatchUserBodySchema } from "../../lib/validations/admin-users";
import {
  adminCreateRewardTierBodySchema,
  adminPatchRewardTierBodySchema,
} from "../../lib/validations/admin-reward-tier";
import {
  adminCreateCampaignUpdateBodySchema,
  adminPatchCampaignUpdateBodySchema,
} from "../../lib/validations/admin-campaign-update-entity";
import {
  adminCreateCampaignBodySchema,
  adminUpdateCampaignBodySchema,
} from "../../lib/validations/admin-campaign";
import {
  adminNotificationTargetQuerySchema,
  adminSendNotificationBodySchema,
} from "../../lib/validations/admin-notification";
import { requireAdminPlugin } from "../plugins/admin-auth.plugin";
import {
  getAdminStatsSummary,
  getAdminStatsTimeseries,
} from "../services/admin-stats.service";
import {
  getUserById,
  listUsers,
  updateUser,
} from "../services/admin-users.service";
import {
  getPledgeById,
  listPledges,
  updatePledgeStatus,
} from "../services/admin-pledges.service";
import {
  getPaymentTransactionById,
  listPaymentTransactions,
} from "../services/admin-transactions.service";
import {
  createWithdrawalRequest,
  deleteWithdrawalRequest,
  getWithdrawalRequestById,
  listWithdrawalRequestsWithUsers,
  updateWithdrawalRequest,
} from "../services/admin-withdrawal-requests.service";
import {
  createRewardTier,
  deleteRewardTier,
  getRewardTierById,
  listRewardTiersByCampaign,
  updateRewardTier,
} from "../services/admin-reward-tiers.service";
import {
  createCampaignUpdate,
  deleteCampaignUpdate,
  getCampaignUpdateById,
  listCampaignUpdatesByCampaign,
  updateCampaignUpdate,
} from "../services/admin-campaign-updates.service";
import {
  createCampaign,
  deleteCampaign,
  getCampaignById,
  listCampaigns,
  updateCampaign,
} from "../services/admin-campaigns.service";
import {
  listKycSubmissions,
  updateKycSubmissionDecision,
} from "../services/admin-kyc.service";
import {
  listAdminNotifications,
  listNotificationTargets,
  sendAdminNotification,
} from "../services/admin-notifications.service";

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
  .get("/stats/summary", async () => apiOk(await getAdminStatsSummary()))
  .get("/notification-targets", async ({ query, set }) => {
    const parsed = adminNotificationTargetQuerySchema.safeParse(query);
    if (!parsed.success) {
      set.status = 400;
      return apiFail(
        validationCode,
        parsed.error.issues[0]?.message ?? "Invalid query",
      );
    }
    const rows = await listNotificationTargets(parsed.data);
    return apiOk(rows);
  })
  .get("/notifications", async ({ query, set }) => {
    const parsed = paginationQuerySchema.safeParse(query);
    if (!parsed.success) {
      set.status = 400;
      return apiFail(
        validationCode,
        parsed.error.issues[0]?.message ?? "Invalid query",
      );
    }
    const { rows, total, page, pageSize } = await listAdminNotifications({
      page: parsed.data.page,
      pageSize: parsed.data.pageSize,
      search: parsed.data.search,
    });
    return apiOk({ items: rows, total, page, pageSize });
  })
  .post("/notifications/send", async ({ body, set }) => {
    const parsed = adminSendNotificationBodySchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return apiFail(
        validationCode,
        parsed.error.issues[0]?.message ?? "Invalid body",
      );
    }
    const result = await sendAdminNotification(parsed.data);
    return apiOk(result);
  })
  .get("/stats/timeseries", async ({ query, set }) => {
    const parsed = statsRangeQuerySchema.safeParse(query);
    if (!parsed.success) {
      set.status = 400;
      return apiFail(
        validationCode,
        parsed.error.issues[0]?.message ?? "Invalid query",
      );
    }
    const data = await getAdminStatsTimeseries(parsed.data.range);
    return apiOk({ range: parsed.data.range, points: data });
  })
  .get("/users", async ({ query, set }) => {
    const parsed = paginationQuerySchema.safeParse(query);
    if (!parsed.success) {
      set.status = 400;
      return apiFail(
        validationCode,
        parsed.error.issues[0]?.message ?? "Invalid query",
      );
    }
    const { page, pageSize, search } = parsed.data;
    const {
      rows,
      total,
      page: p,
      pageSize: ps,
    } = await listUsers({
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
      return apiFail(notFoundCode, "User not found");
    }
    return apiOk(row);
  })
  .patch("/users/:id", async ({ params, body, set }) => {
    const parsed = adminPatchUserBodySchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return apiFail(
        validationCode,
        parsed.error.issues[0]?.message ?? "Invalid body",
      );
    }
    const row = await updateUser(params.id, parsed.data);
    if (!row) {
      set.status = 404;
      return apiFail(notFoundCode, "User not found");
    }
    return apiOk(row);
  })
  .get("/pledges", async ({ query, set }) => {
    const parsed = paginationQuerySchema.safeParse(query);
    if (!parsed.success) {
      set.status = 400;
      return apiFail(
        validationCode,
        parsed.error.issues[0]?.message ?? "Invalid query",
      );
    }
    const { rows, total, page, pageSize } = await listPledges({
      page: parsed.data.page,
      pageSize: parsed.data.pageSize,
    });
    return apiOk({ items: rows, total, page, pageSize });
  })
  .get("/pledges/:id", async ({ params, set }) => {
    const row = await getPledgeById(params.id);
    if (!row) {
      set.status = 404;
      return apiFail(notFoundCode, "Pledge not found");
    }
    return apiOk(row);
  })
  .patch("/pledges/:id", async ({ params, body, set }) => {
    const parsed = adminPatchPledgeBodySchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return apiFail(
        validationCode,
        parsed.error.issues[0]?.message ?? "Invalid body",
      );
    }
    const row = await updatePledgeStatus(params.id, parsed.data.status);
    if (!row) {
      set.status = 404;
      return apiFail(notFoundCode, "Pledge not found");
    }
    return apiOk(row);
  })
  .get("/transactions", async ({ query, set }) => {
    const parsed = paginationQuerySchema.safeParse(query);
    if (!parsed.success) {
      set.status = 400;
      return apiFail(
        validationCode,
        parsed.error.issues[0]?.message ?? "Invalid query",
      );
    }
    const { rows, total, page, pageSize } = await listPaymentTransactions({
      page: parsed.data.page,
      pageSize: parsed.data.pageSize,
      search: parsed.data.search,
      startDate: parsed.data.startDate,
      endDate: parsed.data.endDate,
    });

    return apiOk({ items: rows, total, page, pageSize });
  })
  .get("/transactions/:id", async ({ params, set }) => {
    const row = await getPaymentTransactionById(params.id);
    if (!row) {
      set.status = 404;
      return apiFail(notFoundCode, "Transaction not found");
    }
    return apiOk(row);
  })
  .get("/withdrawal-requests", async ({ query, set }) => {
    const parsed = paginationQuerySchema.safeParse(query);
    if (!parsed.success) {
      set.status = 400;
      return apiFail(
        validationCode,
        parsed.error.issues[0]?.message ?? "Invalid query",
      );
    }
    const { rows, total, page, pageSize } =
      await listWithdrawalRequestsWithUsers({
        page: parsed.data.page,
        pageSize: parsed.data.pageSize,
      });
    return apiOk({ items: rows, total, page, pageSize });
  })
  .get("/withdrawal-requests/:id", async ({ params, set }) => {
    const row = await getWithdrawalRequestById(params.id);
    if (!row) {
      set.status = 404;
      return apiFail(notFoundCode, "Withdrawal not found");
    }
    return apiOk(row);
  })
  .post("/withdrawal-requests", async ({ body, set }) => {
    const parsed = adminCreateWithdrawalRequestBodySchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return apiFail(
        validationCode,
        parsed.error.issues[0]?.message ?? "Invalid body",
      );
    }
    const user = await getUserById(parsed.data.userId);
    if (!user) {
      set.status = 404;
      return apiFail(notFoundCode, "User not found");
    }
    const row = await createWithdrawalRequest(parsed.data);
    set.status = 201;
    return apiOk(row);
  })
  .patch("/withdrawal-requests/:id", async ({ params, body, admin, set }) => {
    const parsed = adminPatchWithdrawalRequestBodySchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return apiFail(
        validationCode,
        parsed.error.issues[0]?.message ?? "Invalid body",
      );
    }
    const row = await updateWithdrawalRequest(params.id, parsed.data, {
      actorAdminId: admin!.id,
    });
    if (!row) {
      set.status = 404;
      return apiFail(notFoundCode, "Withdrawal not found");
    }
    return apiOk(row);
  })
  .delete("/withdrawal-requests/:id", async ({ params, set }) => {
    const ok = await deleteWithdrawalRequest(params.id);
    if (!ok) {
      set.status = 404;
      return apiFail(notFoundCode, "Withdrawal not found");
    }
    return apiOk({ deleted: true as const });
  })
  .get("/campaigns/:campaignId/reward-tiers", async ({ params, set }) => {
    const c = await getCampaignById(params.campaignId);
    if (!c) {
      set.status = 404;
      return apiFail(notFoundCode, "Campaign not found");
    }
    return apiOk(await listRewardTiersByCampaign(params.campaignId));
  })
  .post(
    "/campaigns/:campaignId/reward-tiers",
    async ({ params, body, set }) => {
      const c = await getCampaignById(params.campaignId);
      if (!c) {
        set.status = 404;
        return apiFail(notFoundCode, "Campaign not found");
      }
      const parsed = adminCreateRewardTierBodySchema.safeParse(body);
      if (!parsed.success) {
        set.status = 400;
        return apiFail(
          validationCode,
          parsed.error.issues[0]?.message ?? "Invalid body",
        );
      }
      const row = await createRewardTier(params.campaignId, parsed.data);
      set.status = 201;
      return apiOk(row);
    },
  )
  .get("/reward-tiers/:id", async ({ params, set }) => {
    const row = await getRewardTierById(params.id);
    if (!row) {
      set.status = 404;
      return apiFail(notFoundCode, "Reward tier not found");
    }
    return apiOk(row);
  })
  .patch("/reward-tiers/:id", async ({ params, body, set }) => {
    const parsed = adminPatchRewardTierBodySchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return apiFail(
        validationCode,
        parsed.error.issues[0]?.message ?? "Invalid body",
      );
    }
    const row = await updateRewardTier(params.id, parsed.data);
    if (!row) {
      set.status = 404;
      return apiFail(notFoundCode, "Reward tier not found");
    }
    return apiOk(row);
  })
  .delete("/reward-tiers/:id", async ({ params, set }) => {
    const ok = await deleteRewardTier(params.id);
    if (!ok) {
      set.status = 404;
      return apiFail(notFoundCode, "Reward tier not found");
    }
    return apiOk({ deleted: true as const });
  })
  .get("/campaigns/:campaignId/updates", async ({ params, set }) => {
    const c = await getCampaignById(params.campaignId);
    if (!c) {
      set.status = 404;
      return apiFail(notFoundCode, "Campaign not found");
    }
    return apiOk(await listCampaignUpdatesByCampaign(params.campaignId));
  })
  .post("/campaigns/:campaignId/updates", async ({ params, body, set }) => {
    const c = await getCampaignById(params.campaignId);
    if (!c) {
      set.status = 404;
      return apiFail(notFoundCode, "Campaign not found");
    }
    const parsed = adminCreateCampaignUpdateBodySchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return apiFail(
        validationCode,
        parsed.error.issues[0]?.message ?? "Invalid body",
      );
    }
    const row = await createCampaignUpdate(params.campaignId, parsed.data);
    set.status = 201;
    return apiOk(row);
  })
  .get("/campaign-updates/:id", async ({ params, set }) => {
    const row = await getCampaignUpdateById(params.id);
    if (!row) {
      set.status = 404;
      return apiFail(notFoundCode, "Update not found");
    }
    return apiOk(row);
  })
  .patch("/campaign-updates/:id", async ({ params, body, set }) => {
    const parsed = adminPatchCampaignUpdateBodySchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return apiFail(
        validationCode,
        parsed.error.issues[0]?.message ?? "Invalid body",
      );
    }
    const row = await updateCampaignUpdate(params.id, parsed.data);
    if (!row) {
      set.status = 404;
      return apiFail(notFoundCode, "Update not found");
    }
    return apiOk(row);
  })
  .delete("/campaign-updates/:id", async ({ params, set }) => {
    const ok = await deleteCampaignUpdate(params.id);
    if (!ok) {
      set.status = 404;
      return apiFail(notFoundCode, "Update not found");
    }
    return apiOk({ deleted: true as const });
  })
  .get("/kyc-submissions", async ({ query, set }) => {
    const parsed = paginationQuerySchema.safeParse(query);
    if (!parsed.success) {
      set.status = 400;
      return apiFail(
        validationCode,
        parsed.error.issues[0]?.message ?? "Invalid query",
      );
    }
    const { rows, total, page, pageSize } = await listKycSubmissions({
      page: parsed.data.page,
      pageSize: parsed.data.pageSize,
    });
    return apiOk({ items: rows, total, page, pageSize });
  })
  .patch("/kyc-submissions/:id", async ({ params, body, admin, set }) => {
    const b = body as Record<string, unknown>;
    if (typeof b.status !== "string") {
      set.status = 400;
      return apiFail(validationCode, "status is required");
    }
    const allowed = new Set([
      "PENDING",
      "UNDER_REVIEW",
      "APPROVED",
      "REJECTED",
      "EXPIRED",
    ]);
    if (!allowed.has(b.status)) {
      set.status = 400;
      return apiFail(validationCode, "Invalid status");
    }
    const row = await updateKycSubmissionDecision({
      id: params.id,
      reviewerUserId: admin!.id,
      status: b.status as
        | "PENDING"
        | "UNDER_REVIEW"
        | "APPROVED"
        | "REJECTED"
        | "EXPIRED",
      rejectionReason:
        typeof b.rejectionReason === "string" ? b.rejectionReason : null,
    });
    if (!row) {
      set.status = 404;
      return apiFail(notFoundCode, "KYC submission not found");
    }
    return apiOk(row);
  })
  .get("/campaigns", async ({ query, set }) => {
    const parsed = paginationQuerySchema.safeParse(query);
    if (!parsed.success) {
      set.status = 400;
      return apiFail(
        validationCode,
        parsed.error.issues[0]?.message ?? "Invalid query",
      );
    }
    const { rows, total, page, pageSize } = await listCampaigns({
      page: parsed.data.page,
      pageSize: parsed.data.pageSize,
      search: parsed.data.search,
    });
    return apiOk({ items: rows, total, page, pageSize });
  })
  .get("/campaigns/:campaignId", async ({ params, set }) => {
    const row = await getCampaignById(params.campaignId);
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
  .patch("/campaigns/:campaignId", async ({ params, body, set }) => {
    const parsed = adminUpdateCampaignBodySchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return apiFail(
        validationCode,
        parsed.error.issues[0]?.message ?? "Invalid request body",
      );
    }
    const row = await updateCampaign(params.campaignId, parsed.data);
    if (!row) {
      set.status = 404;
      return apiFail(notFoundCode, "Campaign not found");
    }
    return apiOk(row);
  })
  .delete("/campaigns/:campaignId", async ({ params, set }) => {
    const ok = await deleteCampaign(params.campaignId);
    if (!ok) {
      set.status = 404;
      return apiFail(notFoundCode, "Campaign not found");
    }
    return apiOk({ deleted: true as const });
  })
  // Ticket management endpoints
  .get("/tickets", async ({ query, set }) => {
    const { listTicketsQuerySchema } =
      await import("../../lib/validations/ticket");
    const { listTickets } = await import("../services/ticket.service");

    const parsed = listTicketsQuerySchema.safeParse(query);
    if (!parsed.success) {
      set.status = 400;
      return apiFail(
        "VALIDATION",
        parsed.error.issues[0]?.message ?? "Invalid query parameters",
      );
    }

    try {
      const result = await listTickets(parsed.data);
      return apiOk(result);
    } catch (error) {
      set.status = 500;
      return apiFail(
        "SERVER_ERROR",
        error instanceof Error ? error.message : "Failed to fetch tickets",
      );
    }
  })
  .get("/tickets/:id", async ({ params, set }) => {
    const { getTicketById } = await import("../services/ticket.service");

    try {
      const ticket = await getTicketById(params.id);
      if (!ticket) {
        set.status = 404;
        return apiFail("NOT_FOUND", "Ticket not found");
      }
      return apiOk(ticket);
    } catch (error) {
      set.status = 500;
      return apiFail(
        "SERVER_ERROR",
        error instanceof Error ? error.message : "Failed to fetch ticket",
      );
    }
  })
  .patch("/tickets/:id", async ({ params, body, set, admin }) => {
    const { updateTicketSchema } = await import("../../lib/validations/ticket");
    const { updateTicket } = await import("../services/ticket.service");

    if (!admin) {
      set.status = 401;
      return apiFail("UNAUTHORIZED", "Admin authentication required");
    }

    const parsed = updateTicketSchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return apiFail(
        "VALIDATION",
        parsed.error.issues[0]?.message ?? "Invalid ticket data",
      );
    }

    try {
      const ticket = await updateTicket(params.id, parsed.data, admin.id);
      if (!ticket) {
        set.status = 404;
        return apiFail("NOT_FOUND", "Ticket not found");
      }
      return apiOk(ticket);
    } catch (error) {
      set.status = 500;
      return apiFail(
        "SERVER_ERROR",
        error instanceof Error ? error.message : "Failed to update ticket",
      );
    }
  })
  .post("/upload-image", async ({ request, set }) => {
    const { status, result } = await executeImageUpload(request, {
      folder: "nexiaa/campaigns",
      adminOnly: true,
    });
    set.status = status;
    return result;
  })
  .delete("/upload-image", async ({ request, set }) => {
    const { status, result } = await executeImageDelete(request, {
      adminOnly: true,
    });
    set.status = status;
    return result;
  });
