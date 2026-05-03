import { Suspense } from "react";
import { PageHero } from "@/components/page-shell";
import { listBrowseableCampaigns } from "@/lib/services/public-campaigns";
import { CampaignsPageClient } from "@/app/campaigns/campaigns-client";

export default async function CampaignsBrowsePage() {
  const campaigns = await listBrowseableCampaigns();

  return (
    <main>
      <PageHero
        eyebrow="Place de marché"
        title={
          <>
            Découvrez les <span className="text-mint">campagnes</span>
          </>
        }
        subtitle="Collectes de fonds en cours et financées que vous pouvez suivre ou sauvegarder sur votre compte. Parcourez des campagnes vérifiées du monde entier."
      />

      <Suspense
        fallback={<div className="container py-12">Chargement des campagnes...</div>}
      >
        <CampaignsPageClient
          campaigns={campaigns}
        />
      </Suspense>
    </main>
  );
}
