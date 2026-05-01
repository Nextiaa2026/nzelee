import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getPublicCampaignBySlug } from "@/lib/services/public-campaigns";
import { getUserEligibilityProfile } from "@/lib/services/user-eligibility";
import { CheckoutView } from "@/components/campaigns/checkout-view";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const campaign = await getPublicCampaignBySlug(slug);
  if (!campaign) return { title: "Checkout" };
  return { title: `Checkout · ${campaign.title}` };
}

export default async function CheckoutPage({ params }: PageProps) {
  const { slug } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect(
      `/login?callbackUrl=${encodeURIComponent(`/campaigns/${slug}/checkout`)}`,
    );
  }

  const campaign = await getPublicCampaignBySlug(slug);
  if (!campaign) notFound();

  const eligibility = await getUserEligibilityProfile(session.user.id);
  const kycApproved = Boolean(
    eligibility?.isKycApproved && eligibility?.isEligibleToInvest,
  );

  return <CheckoutView campaign={campaign} kycApproved={kycApproved} />;
}
