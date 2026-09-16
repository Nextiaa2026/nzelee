import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";

import { CampaignReviewForm } from "@/components/campaigns/campaign-review-form";
import { CampaignDetailsPublicBlock } from "@/components/campaigns/campaign-details-public-block";
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
  if (!campaign) return { title: "Campagne non trouvée" };
  return {
    title: `${campaign.title} | Détails de la campagne`,
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
    <main className="min-h-svh bg-neutral-100 pb-20 pt-0">
      <CampaignDetailsPublicBlock campaign={clientPayload} rates={rates} />

      <div className="mx-auto max-w-6xl px-4 md:px-8 lg:px-12">
        <section className="mt-2 grid gap-6 md:grid-cols-[1fr_.95fr]">
          <div className="rounded-2xl border border-deep-green/10 bg-white p-6 shadow-[0_8px_30px_-12px_rgba(5,45,29,0.14),0_2px_8px_-4px_rgba(5,45,29,0.06)]">
            <h2 className="font-sans text-lg font-semibold text-deep-green">
              Avis des investisseurs
            </h2>
            <p className="mt-1 text-sm text-deep-green/60">
              Retours réels des utilisateurs ayant évalué cette campagne.
            </p>
            <div className="mt-5">
              {campaign.reviews.length ? (
                <div className="space-y-3">
                  {campaign.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="rounded-xl border border-deep-green/10 bg-neutral-50 p-4"
                    >
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mint text-xs font-semibold text-deep-green">
                            {(review.userName ?? "U")
                              .split(" ")
                              .map((p) => p[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <p className="text-sm font-medium text-deep-green">
                            {review.userName}
                          </p>
                        </div>
                        <p className="shrink-0 text-xs text-deep-green/50">
                          {formatDateLong(review.createdAt)}
                        </p>
                      </div>
                      <div
                        className="mb-2 flex gap-0.5"
                        aria-label={`${review.rating} sur 5 étoiles`}
                      >
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "size-4",
                              i < review.rating
                                ? "fill-mint text-mint"
                                : "text-deep-green/20",
                            )}
                            strokeWidth={i < review.rating ? 0 : 1.25}
                            aria-hidden
                          />
                        ))}
                      </div>
                      <p className="text-sm text-deep-green/75">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-deep-green/60">
                  Pas encore d&apos;avis.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-deep-green/10 bg-white p-6 shadow-[0_8px_30px_-12px_rgba(5,45,29,0.14),0_2px_8px_-4px_rgba(5,45,29,0.06)]">
            <h2 className="font-sans text-lg font-semibold text-deep-green">
              Ajoutez votre avis
            </h2>
            <p className="mt-1 text-sm text-deep-green/60">
              Les utilisateurs connectés peuvent noter et commenter cette
              campagne.
            </p>
            <div className="mt-5">
              <CampaignReviewForm slug={campaign.slug} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
