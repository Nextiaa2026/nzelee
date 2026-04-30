import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { SITE_NAME } from "@/lib/brand";

/**
 * Identity verification — standalone flow (no dashboard chrome).
 * Highly focused, distraction-free layout.
 */
export default async function KycLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent("/kyc")}`);
  }
  if (!session.user.emailVerified) {
    redirect("/login?error=unverified_email");
  }
  if (!session.user.onboardingComplete) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-svh bg-[#FAFAFA] text-foreground flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:px-6">
        <div className="w-full max-w-xl">
          {children}
        </div>
      </main>
      <footer className="py-6 px-4 text-center border-t border-black/5">
        <p className="text-xs text-black/30 font-medium">
          &copy; {new Date().getFullYear()} {SITE_NAME}. Secure identity verification.
        </p>
      </footer>
    </div>
  );
}

