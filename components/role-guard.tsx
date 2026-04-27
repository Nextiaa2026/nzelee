"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { hasAnyRole } from "@/lib/auth/roles";
import type { AppUserRole } from "@/types/app-user";

type RoleGuardProps = {
  /** Roles that may render `children`. */
  allow: readonly AppUserRole[];
  children: React.ReactNode;
  /** Shown while session is loading or before redirect (optional). */
  fallback?: React.ReactNode;
  /** Where to send users who fail the check (default: /unauthorized). */
  redirectTo?: string;
  /** If true, unauthenticated users go here instead of /login. */
  redirectUnauthenticatedTo?: string;
};

/**
 * Client guard: wraps protected UI and redirects when the session role is not allowed.
 * Prefer `ServerRoleGuard` for server-rendered pages when you want zero flash.
 */
export function RoleGuard({
  allow,
  children,
  fallback = null,
  redirectTo = "/unauthorized",
  redirectUnauthenticatedTo = "/login",
}: RoleGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const role = session?.user?.role;

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.replace(redirectUnauthenticatedTo);
      return;
    }
    if (!hasAnyRole(role, allow)) {
      router.replace(redirectTo);
    }
  }, [status, role, allow, redirectTo, redirectUnauthenticatedTo, router]);

  if (status === "loading") {
    return <>{fallback}</>;
  }
  if (status === "unauthenticated" || !hasAnyRole(role, allow)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
