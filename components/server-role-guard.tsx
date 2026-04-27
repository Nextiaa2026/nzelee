import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { hasAnyRole } from "@/lib/auth/roles";
import type { AppUserRole } from "@/types/app-user";

type ServerRoleGuardProps = {
  allow: readonly AppUserRole[];
  children: React.ReactNode;
  redirectTo?: string;
  redirectUnauthenticatedTo?: string;
};

/**
 * Server guard for layouts/pages: no client flash; fails closed on missing session or role.
 */
export async function ServerRoleGuard({
  allow,
  children,
  redirectTo = "/unauthorized",
  redirectUnauthenticatedTo = "/login",
}: ServerRoleGuardProps) {
  const session = await auth();

  if (!session?.user) {
    redirect(redirectUnauthenticatedTo);
  }

  if (!hasAnyRole(session.user.role, allow)) {
    redirect(redirectTo);
  }

  return <>{children}</>;
}
