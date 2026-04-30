import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

import {
  adminController,
  authController,
  healthController,
  publicController,
  ticketController,
  notchpayController,
  userProfileController,
} from "./controllers";
import { userController } from "./user.controller";

/**
 * All Elysia HTTP routes live under this path.
 * Next.js exposes them via `app/api/v1/[[...slugs]]/route.ts` (do not add parallel `app/api/*` handlers).
 * NextAuth remains at `app/api/auth/[...nextauth]/route.ts` only.
 */
export const API_BASE_PATH = "/api/v1";

export function createApiApp() {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXTAUTH_URL ??
    "http://localhost:3000";

  return new Elysia({ prefix: API_BASE_PATH })
    .use(
      cors({
        origin: process.env.CORS_ORIGIN ?? appUrl,
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
      }),
    )
    .use(healthController)
    .use(publicController)
    .use(ticketController)
    .use(userController)
    .use(userProfileController)
    .use(notchpayController)
    .use(authController)
    .use(adminController);
}
