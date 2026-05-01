import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, pledges } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { getUserAccountSummary } from "@/lib/services/user-account-summary";
import { getUserWalletSnapshot } from "@/lib/services/user-wallet-snapshot";
import { getUserEligibilityProfile } from "@/lib/services/user-eligibility";
import { ProfileDashboardView } from "@/components/profile/profile-dashboard-view";
import { redirect } from "next/navigation";

type PageProps = {
  searchParams: Promise<{ txPage?: string }>;
};

export default async function ProfilePage({ searchParams }: PageProps) {
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

  const query = await searchParams;
  const txPage = Math.max(1, Number.parseInt(query.txPage ?? "1", 10) || 1);
  const txPageSize = 10;
  const txOffset = (txPage - 1) * txPageSize;

  const [summary, wallet, latestTransactions, txCountRows, eligibility] =
    await Promise.all([
    getUserAccountSummary(user.id),
    getUserWalletSnapshot(user.id),
    db
      .select()
      .from(pledges)
      .where(eq(pledges.backerId, user.id))
      .orderBy(desc(pledges.createdAt))
      .limit(txPageSize)
      .offset(txOffset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(pledges)
      .where(eq(pledges.backerId, user.id)),
    getUserEligibilityProfile(user.id),
    ]);

  const txTotal = txCountRows[0]?.count ?? 0;
  const txPageCount = Math.max(1, Math.ceil(txTotal / txPageSize));
  const safeTxPage = Math.min(txPage, txPageCount);

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
      txPage={safeTxPage}
      txPageCount={txPageCount}
      kycStatus={eligibility?.kycStatus ?? "PENDING"}
    />
  );
}
