import type { AppUserRole } from "@/types/app-user";

export const ROLES = {
  USER: "USER",
  CREATOR: "CREATOR",
  ADMIN: "ADMIN",
} as const satisfies Record<string, AppUserRole>;

export function isAdminRole(role: string | null | undefined): role is "ADMIN" {
  return role === "ADMIN";
}

export function hasAnyRole(
  userRole: string | null | undefined,
  allowed: readonly AppUserRole[],
): userRole is AppUserRole {
  if (!userRole) return false;
  return (allowed as readonly string[]).includes(userRole);
}
