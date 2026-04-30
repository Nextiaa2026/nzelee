import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, pledges } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { getUserAccountSummary } from "@/lib/services/user-account-summary";
import { getUserWalletSnapshot } from "@/lib/services/user-wallet-snapshot";
import { getUserEligibilityProfile } from "@/lib/services/user-eligibility";
import { ProfileDashboardView } from "@/components/profile/profile-dashboard-view";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!user) {
    redirect("/login");
  }

  const [summary, wallet, latestTransactions, eligibility] = await Promise.all([
    getUserAccountSummary(user.id),
    getUserWalletSnapshot(user.id),
    db
      .select()
      .from(pledges)
      .where(eq(pledges.backerId, user.id))
      .orderBy(desc(pledges.createdAt))
      .limit(5),
    getUserEligibilityProfile(user.id),
  ]);

  return (
    <ProfileDashboardView
      user={{
        name: user.name ?? "User",
        email: user.email ?? "",
        image: user.image ?? null,
        phone: (user as { phone?: string }).phone ?? "",
      }}
      summary={summary}
      wallet={wallet}
      transactions={
        latestTransactions as unknown as Array<{
          id: string;
          amount: number;
          status: string;
          createdAt: Date;
        }>
      }
      kycStatus={eligibility?.kycStatus ?? "PENDING"}
    />
  );
}
