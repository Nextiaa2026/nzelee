"use client";

import { usePathname } from "next/navigation";

import { GlobalSiteFooter } from "@/components/global-site-footer";
import { GlobalSiteHeader } from "@/components/global-site-header";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";

const hiddenPrefixes = ["/admin", "/dashboard"];
const hiddenExact = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/onboarding",
  "/kyc",
];

export function GlobalSiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";

  const hideOnPrefix = hiddenPrefixes.some((prefix) =>
    pathname.startsWith(prefix),
  );
  const hideOnExact = hiddenExact.includes(pathname);
  const hideOnNestedAuth = pathname.startsWith("/register/");
  const isInvestPage = pathname.endsWith("/invest");

  if (hideOnPrefix || hideOnExact || hideOnNestedAuth || isInvestPage) {
    return <>{children}</>;
  }

  return (
    <>
      <GlobalSiteHeader />
      <div className="pb-16 md:pb-0">{children}</div>
      <GlobalSiteFooter />
      <MobileBottomNav />
    </>
  );
}
