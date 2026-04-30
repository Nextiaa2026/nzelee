import { Suspense } from "react";
import { PageHero } from "@/components/page-shell";
import { listBrowseableCampaigns } from "@/lib/services/public-campaigns";
import { CampaignsPageClient } from "@/app/campaigns/campaigns-client";

type SearchParams = {
  page?: string;
  search?: string;
  filter?: string;
};

export default async function CampaignsBrowsePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || "";
  const filter = searchParams.filter || "All";

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
          initialPage={page}
          initialSearch={search}
          initialFilter={filter}
        />
      </Suspense>
    </main>
  );
}
