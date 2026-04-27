import { Elysia } from "elysia";

import { auth } from "@/lib/auth";
import { apiFail, apiOk } from "../lib/http/api-result";
import { userCreateWithdrawalBodySchema } from "../lib/validations/user-withdrawal";
import {
  createWithdrawalForUser,
  listWithdrawalsForUser,
} from "./services/user-withdrawal-requests.service";

/**
 * Authenticated user routes: `GET/POST /api/v1/withdrawals`.
 */
export const userController = new Elysia()
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
  });
