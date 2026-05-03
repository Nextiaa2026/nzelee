import { auth } from "@/lib/auth";
import { SAMPLE_PLEDGE_CAMPAIGNS } from "@/lib/dashboard/sample-pledge-campaigns";
import { DashboardHomeOverview } from "@/components/dashboard/dashboard-home-overview";
import { getUserAccountSummary } from "@/lib/services/user-account-summary";
import { getUserWalletSnapshot } from "@/lib/services/user-wallet-snapshot";
import { listBrowseableCampaigns } from "@/lib/services/public-campaigns";
import { getUserEligibilityProfile } from "@/lib/services/user-eligibility";

export default async function UserDashboardPage() {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";
  const [summary, allCampaigns, wallet, eligibility] = await Promise.all([
    session?.user?.id
      ? getUserAccountSummary(session.user.id)
      : {
          campaigns: 0,
          investments: 0,
          investedAmount: 0,
          unreadNotifications: 0,
          pendingWithdrawals: 0,
        },
    listBrowseableCampaigns(),
    session?.user?.id
      ? getUserWalletSnapshot(session.user.id)
      : {
          currency: "USD",
          availableCents: 0,
          pendingWithdrawalCents: 0,
          lifetimeCreditsCents: 0,
          lifetimeWithdrawnCents: 0,
        },
    session?.user?.id ? getUserEligibilityProfile(session.user.id) : null,
  ]);

  const featuredOnly = allCampaigns.filter((c) => c.isFeatured);
  let displayCampaigns =
    featuredOnly.length > 0
      ? featuredOnly.slice(0, 3)
      : allCampaigns.slice(0, 3);
  const usingSamplePledges = displayCampaigns.length === 0;
  if (usingSamplePledges) {
    displayCampaigns = SAMPLE_PLEDGE_CAMPAIGNS;
  }
  const campaignsSectionTitle = featuredOnly.length
    ? "Campagnes à la une"
    : allCampaigns.length > 0
      ? "Campagnes pour vous"
      : "Exemples de campagnes";

  const campaignCards = displayCampaigns.map((c) => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    summary: c.summary,
    coverImageUrl: c.coverImageUrl,
    raisedAmount: c.raisedAmount,
    goalAmount: c.goalAmount,
    currency: c.currency,
    status: c.status,
    isFeatured: c.isFeatured,
    isDemo: usingSamplePledges,
  }));

  return (
    <DashboardHomeOverview
      userName={session?.user?.name ?? null}
      isAdmin={isAdmin}
      kycStatus={eligibility?.kycStatus ?? null}
      summary={summary}
      wallet={{
        currency: wallet.currency,
        availableCents: wallet.availableCents,
        pendingWithdrawalCents: wallet.pendingWithdrawalCents,
        lifetimeWithdrawnCents: wallet.lifetimeWithdrawnCents,
      }}
      campaigns={campaignCards}
      campaignsSectionTitle={campaignsSectionTitle}
      usingSamplePledges={usingSamplePledges}
      browseableCampaignCount={allCampaigns.length}
    />
  );
}
