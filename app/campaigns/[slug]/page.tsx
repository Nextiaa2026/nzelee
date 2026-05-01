import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";

import { CampaignReviewForm } from "@/components/campaigns/campaign-review-form";
import { CampaignDetailsPublicBlock } from "@/components/campaigns/campaign-details-public-block";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDateLong } from "@/lib/format/date";
import { cn } from "@/lib/utils";
import { getUsdRates } from "@/lib/services/exchange-rate";
import { getPublicCampaignBySlug } from "@/lib/services/public-campaigns";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const campaign = await getPublicCampaignBySlug(slug);
  if (!campaign) return { title: "Campaign not found" };
  return {
    title: `${campaign.title} | Campaign details`,
    description: campaign.summary,
  };
}

export default async function CampaignDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const campaign = await getPublicCampaignBySlug(slug);
  if (!campaign) notFound();

  const rates = await getUsdRates();

  const clientPayload = {
    title: campaign.title,
    slug: campaign.slug,
    summary: campaign.summary,
    description: campaign.description,
    locationLabel: campaign.locationLabel,
    activitySector: campaign.activitySector,
    projectOwner: campaign.projectOwner,
    isVerified: campaign.isVerified,
    status: campaign.status,
    coverImageUrl: campaign.coverImageUrl,
    minimumInvestmentAmount: campaign.minimumInvestmentAmount,
    targetReturnRate: campaign.targetReturnRate,
    durationMonths: campaign.durationMonths,
    galleryImages: campaign.galleryImages,
    impactPoints: campaign.impactPoints,
    goalAmount: campaign.goalAmount,
    raisedAmount: campaign.raisedAmount,
    currency: campaign.currency,
    startsAt: campaign.startsAt?.toISOString() ?? null,
    endsAt: campaign.endsAt?.toISOString() ?? null,
    investors: campaign.investors,
  };

  return (
    <main className="min-h-svh pb-20 pt-0">
      <CampaignDetailsPublicBlock campaign={clientPayload} rates={rates} />

      <div className="mx-auto max-w-6xl px-4 md:px-6">
      <section className="mt-10 grid gap-6 md:grid-cols-[1fr_.95fr]">
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle>Investor reviews</CardTitle>
            <CardDescription>
              Real feedback from users who reviewed this campaign.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {campaign.reviews.length ? (
              <div className="space-y-3">
                {campaign.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-xl border border-black/10 bg-white/70 p-3"
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mint text-xs font-semibold text-mint-foreground">
                          {(review.userName ?? "U")
                            .split(" ")
                            .map((p) => p[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <p className="text-sm font-medium text-black/90">
                          {review.userName}
                        </p>
                      </div>
                      <p className="shrink-0 text-xs text-black/60">
                        {formatDateLong(review.createdAt)}
                      </p>
                    </div>
                    <div
                      className="mb-2 flex gap-0.5"
                      aria-label={`${review.rating} out of 5 stars`}
                    >
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "size-4",
                            i < review.rating
                              ? "fill-amber-500 text-amber-500"
                              : "text-amber-500/25",
                          )}
                          strokeWidth={i < review.rating ? 0 : 1.25}
                          aria-hidden
                        />
                      ))}
                    </div>
                    <p className="text-sm text-black/75">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-black/60">No reviews yet.</p>
            )}
          </CardContent>
        </Card>
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle>Add your review</CardTitle>
            <CardDescription>
              Signed-in users can rate and review this campaign.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CampaignReviewForm slug={campaign.slug} />
          </CardContent>
        </Card>
      </section>
      </div>
    </main>
  );
}
