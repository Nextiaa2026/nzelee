import { redirect } from "next/navigation";

import { DashboardProviders } from "@/components/dashboard-providers";
import { DashboardSiteHeader } from "@/components/dashboard-site-header";
import { InvestorAppSidebar } from "@/components/investor-app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";

const dashboardSidebarStyle = {
  "--sidebar-width": "calc(var(--spacing) * 72)",
  "--header-height": "calc(var(--spacing) * 16)",
  "--sidebar": "var(--deep-green)",
  "--sidebar-foreground": "var(--deep-green-foreground)",
  "--sidebar-primary": "var(--mint)",
  "--sidebar-primary-foreground": "var(--mint-foreground)",
  "--sidebar-accent": "var(--mint)",
  "--sidebar-accent-foreground": "var(--mint-foreground)",
  "--sidebar-border": "oklch(1 0 0 / 0.14)",
  "--sidebar-ring": "var(--mint)",
} as React.CSSProperties;

export default async function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  if (!session.user.emailVerified) {
    redirect("/login?error=unverified_email");
  }
  if (!session.user.onboardingComplete) {
    redirect("/onboarding");
  }

  return (
    <DashboardProviders style={dashboardSidebarStyle}>
      <InvestorAppSidebar
        user={{
          name: session.user.name ?? "Membre",
          email: session.user.email ?? "",
          avatar: session.user.image ?? "",
        }}
        isAdmin={session.user.role === "ADMIN"}
      />
      <SidebarInset className="flex min-h-screen flex-col bg-[#f7fcf8]">
        <DashboardSiteHeader />
        <div className="flex flex-1 flex-col bg-[#f7fcf8] p-4 md:p-6">
          {children}
        </div>
      </SidebarInset>
    </DashboardProviders>
  );
}
