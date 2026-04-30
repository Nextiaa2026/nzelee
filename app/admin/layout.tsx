import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import { DashboardProviders } from "@/components/dashboard-providers";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";

export default async function AdminLayout({
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
  if (session.user.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  const style = {
    "--sidebar-width": "calc(var(--spacing) * 72)",
    "--header-height": "calc(var(--spacing) * 12)",
    "--sidebar": "var(--deep-green)",
    "--sidebar-foreground": "var(--deep-green-foreground)",
    "--sidebar-primary": "var(--mint)",
    "--sidebar-primary-foreground": "var(--mint-foreground)",
    "--sidebar-accent": "oklch(1 0 0 / 0.12)",
    "--sidebar-accent-foreground": "var(--deep-green-foreground)",
    "--sidebar-border": "oklch(1 0 0 / 0.14)",
    "--sidebar-ring": "var(--mint)",
  } as React.CSSProperties;

  return (
    <DashboardProviders style={style}>
      <AppSidebar
        user={{
          name: session.user.name ?? "Admin",
          email: session.user.email ?? "",
          avatar: session.user.image ?? "",
        }}
      />
      <SidebarInset className="bg-gray-50">
        <SiteHeader />
        <div className="flex flex-1 flex-col bg-gray-50 p-6">{children}</div>
      </SidebarInset>
    </DashboardProviders>
  );
}
