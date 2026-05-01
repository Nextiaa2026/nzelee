import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { InvestCheckoutView } from "@/components/campaigns/invest-checkout-view";
import { auth } from "@/lib/auth";
import { getPublicCampaignBySlug } from "@/lib/services/public-campaigns";
import { getUserEligibilityProfile } from "@/lib/services/user-eligibility";
import { getUsdRates } from "@/lib/services/exchange-rate";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const campaign = await getPublicCampaignBySlug(slug);
  if (!campaign) return { title: "Invest" };
  return { title: `Invest · ${campaign.title}` };
}

export default async function CampaignInvestPage({ params }: PageProps) {
  const { slug } = await params;
  const session = await auth();
  if (!session?.user) {
    redirect(
      `/login?callbackUrl=${encodeURIComponent(`/campaigns/${slug}/invest`)}`,
    );
  }

  const [campaign, rates] = await Promise.all([
    getPublicCampaignBySlug(slug),
    getUsdRates(),
  ]);
  if (!campaign) notFound();

  const eligibility = await getUserEligibilityProfile(session.user.id);
  const kycApproved = Boolean(
    eligibility?.isKycApproved && eligibility?.isEligibleToInvest,
  );

  const checkoutCampaign = {
    slug: campaign.slug,
    title: campaign.title,
    summary: campaign.summary,
    description: campaign.description,
    activitySector: campaign.activitySector,
    coverImageUrl: campaign.coverImageUrl,
    galleryImages: campaign.galleryImages,
    currency: campaign.currency,
    raisedAmount: campaign.raisedAmount,
    goalAmount: campaign.goalAmount,
    startsAt: campaign.startsAt?.toISOString() ?? null,
    endsAt: campaign.endsAt?.toISOString() ?? null,
    investorsCount: campaign.investors.length,
    reviewsCount: campaign.reviews.length,
  };

  return (
    <InvestCheckoutView
      campaign={checkoutCampaign}
      rates={rates}
      kycApproved={kycApproved}
    />
  );
}
