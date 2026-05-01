import { Elysia } from "elysia";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiFail, apiOk } from "@/lib/http/api-result";
import { getUserWalletSnapshot } from "@/lib/services/user-wallet-snapshot";
import { createCampaignReviewForSlug } from "@/lib/services/campaign-reviews";
import { executeImageDelete, executeImageUpload } from "@/lib/services/image-upload";
import { createCampaignReviewBodySchema } from "@/lib/validations/campaign-review";
import { userKycSubmitBodySchema } from "@/lib/validations/user-kyc";
import { userCreateInvestmentBodySchema } from "@/lib/validations/user-investment";
import { userCreateWithdrawalBodySchema } from "@/lib/validations/user-withdrawal";
import { submitUserKyc } from "./services/user-kyc.service";
import {
  createInvestmentForUser,
  listInvestmentsForUser,
} from "./services/user-investments.service";
import {
  createWithdrawalForUser,
  listWithdrawalsForUser,
} from "./services/user-withdrawal-requests.service";

import { campaigns, paymentTransactions } from "@/lib/db/schema";
import { desc, eq, or } from "drizzle-orm";

/**
 * Authenticated user routes under `/api/v1`: withdrawals, investments, campaign reviews,
 * and signed-in image uploads.
 */
export const userController = new Elysia()
  .get("/transactions", async ({ set }) => {
    const session = await auth();
    const id = session?.user?.id;
    if (!id) {
      set.status = 401;
      return apiFail("UNAUTHORIZED", "Sign in required.");
    }

    try {
      const txs = await db
        .select({
          id: paymentTransactions.id,
          amount: paymentTransactions.amount,
          type: paymentTransactions.type,
          status: paymentTransactions.status,
          createdAt: paymentTransactions.createdAt,
          campaignTitle: campaigns.title,
        })
        .from(paymentTransactions)
        .leftJoin(campaigns, eq(paymentTransactions.campaignId, campaigns.id))
        .where(
          or(
            eq(paymentTransactions.payerUserId, id),
            eq(paymentTransactions.payeeUserId, id),
          ),
        )
        .orderBy(desc(paymentTransactions.createdAt))
        .limit(20);

      return apiOk(txs);
    } catch (error) {
      set.status = 500;
      return apiFail(
        "SERVER_ERROR",
        error instanceof Error ? error.message : "Failed to fetch transactions",
      );
    }
  })
  .get("/wallet", async ({ set }) => {
    const session = await auth();
    const id = session?.user?.id;
    if (!id) {
      set.status = 401;
      return apiFail("UNAUTHORIZED", "Sign in required.");
    }
    return apiOk(await getUserWalletSnapshot(id));
  })
  .get("/withdrawals", async ({ set }) => {
    const session = await auth();
    const id = session?.user?.id;
    if (!id) {
      set.status = 401;
      return apiFail("UNAUTHORIZED", "Sign in required.");
    }
    return apiOk(await listWithdrawalsForUser(id));
  })
  .post("/withdrawals", async ({ body, set }) => {
    const session = await auth();
    const id = session?.user?.id;
    if (!id) {
      set.status = 401;
      return apiFail("UNAUTHORIZED", "Sign in required.");
    }
    const parsed = userCreateWithdrawalBodySchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return apiFail("VALIDATION", parsed.error.issues[0]?.message ?? "Invalid body");
    }
    set.status = 201;
    return apiOk(await createWithdrawalForUser(id, parsed.data));
  })
  .get("/investments", async ({ set }) => {
    const session = await auth();
    const id = session?.user?.id;
    if (!id) {
      set.status = 401;
      return apiFail("UNAUTHORIZED", "Sign in required.");
    }
    return apiOk(await listInvestmentsForUser(id));
  })
  .post("/investments", async ({ body, set }) => {
    const session = await auth();
    const id = session?.user?.id;
    if (!id) {
      set.status = 401;
      return apiFail("UNAUTHORIZED", "Sign in required.");
    }
    const parsed = userCreateInvestmentBodySchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return apiFail("VALIDATION", parsed.error.issues[0]?.message ?? "Invalid body");
    }
    try {
      set.status = 201;
      return apiOk(await createInvestmentForUser(id, parsed.data));
    } catch (error) {
      set.status = 400;
      return apiFail("VALIDATION", error instanceof Error ? error.message : "Failed to invest");
    }
  })
  .post("/campaigns/:slug/reviews", async ({ params, body, set }) => {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      set.status = 403;
      return apiFail("FORBIDDEN", "Sign in to leave a review.");
    }
    const parsed = createCampaignReviewBodySchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return apiFail("VALIDATION", parsed.error.issues[0]?.message ?? "Invalid review.");
    }
    const { status, result } = await createCampaignReviewForSlug(userId, params.slug, parsed.data);
    set.status = status;
    return result;
  })
  .post("/uploads/image", async ({ request, set }) => {
    const url = new URL(request.url);
    const scope = url.searchParams.get("scope");
    const folder = scope === "kyc" ? "nexiaa/kyc" : "nexiaa/uploads";
    const { status, result } = await executeImageUpload(request, { folder });
    set.status = status;
    return result;
  })
  .delete("/uploads/image", async ({ request, set }) => {
    const { status, result } = await executeImageDelete(request, { adminOnly: false });
    set.status = status;
    return result;
  })
  .post("/kyc", async ({ body, set }) => {
    const session = await auth();
    const id = session?.user?.id;
    if (!id) {
      set.status = 401;
      return apiFail("UNAUTHORIZED", "Sign in required.");
    }
    const parsed = userKycSubmitBodySchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return apiFail("VALIDATION", parsed.error.issues[0]?.message ?? "Invalid submission.");
    }
    try {
      const row = await submitUserKyc(id, parsed.data);
      set.status = 201;
      return apiOk({ id: row?.id });
    } catch (error) {
      set.status = 400;
      return apiFail(
        "VALIDATION",
        error instanceof Error ? error.message : "Could not submit verification.",
      );
    }
  });
