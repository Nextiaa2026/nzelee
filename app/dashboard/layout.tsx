import { redirect } from "next/navigation";

import { DashboardAccountHeader } from "@/components/dashboard/dashboard-account-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { auth } from "@/lib/auth";
import { getUserEligibilityProfile } from "@/lib/services/user-eligibility";

/**
 * Signed-in area — compact header + small sidebar (lg+) + main column.
 */
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

  const eligibility = session.user.id
    ? await getUserEligibilityProfile(session.user.id)
    : null;

  return (
    <div className="min-h-svh text-foreground">
      <DashboardAccountHeader
        user={{
          name: session.user.name ?? "Membre",
          email: session.user.email ?? "",
          avatar: session.user.image ?? undefined,
        }}
        kycStatus={eligibility?.kycStatus ?? null}
        isAdmin={session.user.role === "ADMIN"}
      />
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-24 pt-4 md:px-6 md:pb-24 md:pt-6 lg:grid-cols-[240px_1fr] lg:items-start">
        <DashboardSidebar />
        <main className="min-w-0">{children}</main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
