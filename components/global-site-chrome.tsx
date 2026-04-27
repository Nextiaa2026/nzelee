"use client";

import { usePathname } from "next/navigation";

import { GlobalSiteFooter } from "@/components/global-site-footer";
import { GlobalSiteHeader } from "@/components/global-site-header";

const hiddenPrefixes = ["/admin", "/dashboard"];
const hiddenExact = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/onboarding",
];

export function GlobalSiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";

  const hideOnPrefix = hiddenPrefixes.some((prefix) => pathname.startsWith(prefix));
  const hideOnExact = hiddenExact.includes(pathname);
  const hideOnNestedAuth = pathname.startsWith("/register/");

  if (hideOnPrefix || hideOnExact || hideOnNestedAuth) {
    return <>{children}</>;
  }

  return (
    <>
      <GlobalSiteHeader />
      {children}
      <GlobalSiteFooter />
    </>
  );
}
