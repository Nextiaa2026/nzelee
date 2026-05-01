import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { CompanyBrandMark } from "@/components/company-brand-mark";
import { OnboardingView } from "@/components/onboarding-view";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  if (!session.user.emailVerified) {
    redirect("/login?error=unverified_email");
  }

  const [row] = await db
    .select({ completed: users.onboardingCompletedAt })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (row?.completed) {
    if (session.user.role === "ADMIN") {
      redirect("/admin");
    }
    redirect("/dashboard");
  }

  return (
    <div className="min-h-svh w-full bg-white">
      <div className="mx-auto w-full max-w-xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex justify-center">
          <CompanyBrandMark variant="horizontalLightBg" href="/" priority />
        </div>
        <OnboardingView />
      </div>
    </div>
  );
}
