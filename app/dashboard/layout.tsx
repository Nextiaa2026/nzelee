import { redirect } from "next/navigation";

import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { auth } from "@/lib/auth";

/**
 * Signed-in investor / member area — top navigation for activity pages.
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

  const isAdmin = session.user.role === "ADMIN";

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <DashboardNav
        user={{
          name: session.user.name ?? "Member",
          email: session.user.email ?? "",
        }}
        isAdmin={isAdmin}
      />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 md:px-6">
        {children}
      </main>
    </div>
  );
}
