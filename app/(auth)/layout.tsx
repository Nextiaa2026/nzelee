import type { Metadata } from "next";

import { AuthRouteShell } from "@/components/auth-route-shell";
import { SITE_NAME } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Account — ${SITE_NAME}`,
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh w-full [--radius:0.625rem]">
      <AuthRouteShell>{children}</AuthRouteShell>
    </div>
  );
}
