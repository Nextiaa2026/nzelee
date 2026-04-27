import { Elysia } from "elysia";

import { auth } from "@/lib/auth";
import { isAdminRole } from "@/lib/auth/roles";
import type { AppUserRole } from "@/types/app-user";

export type AdminContext = {
  admin: {
    id: string;
    email: string | null | undefined;
    role: AppUserRole;
  };
};

/**
 * Optional auth: signed-in user from the current NextAuth session (any role), or `null`.
 * Use on routes that adapt behavior by role without hard-blocking.
 */
export const sessionAuthPlugin = new Elysia({ name: "session-auth" }).derive(
  { as: "scoped" },
  async () => {
    const session = await auth();
    const user = session?.user;
    if (!user?.id) {
      return { auth: null as null | { id: string; role: AppUserRole; email: string | null } };
    }
    return {
      auth: {
        id: user.id,
        role: user.role ?? "USER",
        email: user.email ?? null,
      },
    };
  },
);

async function resolveAdminFromSession() {
  const session = await auth();
  const user = session?.user;
  if (!user?.id || !isAdminRole(user.role)) {
    return null;
  }
  return {
    id: user.id,
    email: user.email ?? null,
    role: user.role,
  };
}

/**
 * Secures routes under this plugin: only **ADMIN** JWTs may proceed.
 * Mount on admin-only controllers (e.g. prefix `/admin`).
 *
 * Handlers receive `admin` — use after guard; TypeScript may still see
 * `admin | null`; use `admin!` or narrow if your Elysia types do not merge.
 */
export const requireAdminPlugin = new Elysia({ name: "require-admin" })
  .derive({ as: "scoped" }, async () => {
    const admin = await resolveAdminFromSession();
    return { admin };
  })
  .onBeforeHandle(({ admin, set }) => {
    if (!admin) {
      set.status = 403;
      return {
        error: "Forbidden",
        message: "Admin role required. Sign in as an administrator.",
      };
    }
  });
