import { Suspense } from "react";
import { PageHero } from "@/components/page-shell";
import { listBrowseableCampaigns } from "@/lib/services/public-campaigns";
import { CampaignsPageClient } from "@/app/campaigns/campaigns-client";

export default async function CampaignsBrowsePage() {
  const campaigns = await listBrowseableCampaigns();

  return (
    <main>
      <PageHero
        eyebrow="Marketplace"
        title={
          <>
            Discover <span className="text-mint">campaigns</span>
          </>
        }
        subtitle="Live and funded raises you can watch or save to your account. Browse vetted campaigns from around the world."
      />

      <Suspense
        fallback={<div className="container py-12">Loading campaigns...</div>}
      >
        <CampaignsPageClient
          campaigns={campaigns}
        />
      </Suspense>
    </main>
  );
}
