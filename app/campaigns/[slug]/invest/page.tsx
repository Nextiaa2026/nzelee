import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { InvestmentCommitmentForm } from "@/components/forms/investment-commitment-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { formatDateRange } from "@/lib/format/date";
import { CampaignInvestHeroCard } from "@/components/campaigns/campaign-invest-hero-card";
import { getPublicCampaignBySlug } from "@/lib/services/public-campaigns";
import { SITE_NAME } from "@/lib/brand";
import { getUserEligibilityProfile } from "@/lib/services/user-eligibility";
import { getUsdRates } from "@/lib/services/exchange-rate";

type PageProps = { params: Promise<{ slug: string }> };

function formatMoney(amountMinor: number, currency: string) {
  const code = currency.length === 3 ? currency : "USD";
  return (amountMinor / 100).toLocaleString(undefined, {
    style: "currency",
    currency: code,
    maximumFractionDigits: 0,
  });
}

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
  const progress =
    campaign.goalAmount > 0
      ? Math.min(
          100,
          Math.round((campaign.raisedAmount / campaign.goalAmount) * 100),
        )
      : 0;

  return (
    <main className="mx-auto min-h-svh max-w-6xl px-4 pb-20 pt-12 md:px-6">
      <CampaignInvestHeroCard
        title={campaign.title}
        summary={campaign.summary}
        status={campaign.status}
        coverImageUrl={campaign.coverImageUrl}
        raisedAmount={campaign.raisedAmount}
        goalAmount={campaign.goalAmount}
        baseCurrency={campaign.currency}
        rates={rates}
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <div id="checkout-actions" className="scroll-mt-28 space-y-8 lg:col-span-2">
          <section className="rounded-3xl border border-black/6 bg-surface p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <h2 className="font-display text-2xl mb-6">Complete details</h2>
            <div className="prose prose-sm prose-invert max-w-none text-foreground/70">
              <p className="text-lg text-foreground/90 font-medium mb-4">
                {campaign.summary}
              </p>
              {campaign.description.split("\n").map((para, i) => (
                <p key={i} className="mb-4">
                  {para}
                </p>
              ))}
            </div>
          </section>

          {!kycApproved ? (
            <Card className="overflow-hidden rounded-3xl border border-red-200/80 bg-red-50/90 shadow-none ring-1 ring-red-500/10">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-red-900">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  Identity verification required
                </CardTitle>
                <CardDescription className="text-red-700/70">
                  You must complete KYC before you can fund this investment.
                  This is required for compliance and security.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3 pt-4">
                <Button
                  asChild
                  className="border-none bg-red-600 text-white shadow-sm shadow-red-900/10 hover:bg-red-700"
                >
                  <Link href="/kyc">Complete KYC now</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-3xl border border-black/6 bg-surface p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <h2 className="mb-6 font-display text-2xl">
                Make your commitment
              </h2>
              <InvestmentCommitmentForm
                slug={campaign.slug}
                lockSlug
                redirectAfterSuccess="/dashboard/investments"
              />
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <Card className="rounded-3xl border border-black/6 bg-surface-muted/50 shadow-none backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Funding status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] uppercase tracking-wider text-foreground/50">
                  <span>Raised</span>
                  <span>Goal</span>
                </div>
                <div className="flex justify-between font-display text-xl">
                  <span className="text-mint-foreground">
                    {formatMoney(campaign.raisedAmount, campaign.currency)}
                  </span>
                  <span>
                    {formatMoney(campaign.goalAmount, campaign.currency)}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-foreground/5">
                  <div
                    className="h-full bg-mint transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-right text-xs text-foreground/50">
                  {progress}% complete
                </p>
              </div>

              <hr className="border-foreground/5" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-foreground/40">
                    Status
                  </p>
                  <p className="font-medium">{campaign.status}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-foreground/40">
                    Currency
                  </p>
                  <p className="font-medium">{campaign.currency}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] uppercase tracking-widest text-foreground/40">
                    Campaign window
                  </p>
                  <p className="text-xs font-medium">
                    {formatDateRange(campaign.startsAt, campaign.endsAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2 text-xs text-foreground/50">
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground">
                    {campaign.investors.length}
                  </span>
                  <span>Investors</span>
                </div>
                <div className="h-8 w-px bg-foreground/5" />
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground">
                    {campaign.reviews.length}
                  </span>
                  <span>Reviews</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="rounded-3xl border border-mint/10 bg-mint/5 p-6">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-mint-foreground">
              Secure checkout
            </p>
            <p className="text-xs leading-relaxed text-mint-foreground/70">
              {SITE_NAME} uses bank-grade encryption and secure payment gateways
              (Mobile Money & Orange Money) to ensure your transactions are
              protected.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
