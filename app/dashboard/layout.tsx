import { redirect } from "next/navigation";

import { InvestorTopNav } from "@/components/investor-top-nav";
import { TooltipProvider } from "@/components/ui/tooltip";
import { auth } from "@/lib/auth";

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
    <TooltipProvider>
      <div className="flex min-h-screen flex-col bg-neutral-100">
        <InvestorTopNav
          user={{
            name: session.user.name ?? "Membre",
            email: session.user.email ?? "",
            avatar: session.user.image ?? "",
          }}
          isAdmin={session.user.role === "ADMIN"}
        />
        <div className="flex flex-1 flex-col bg-neutral-100 p-4 md:p-6">
          {children}
        </div>
      </div>
    </TooltipProvider>
  );
}
