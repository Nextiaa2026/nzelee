import type { Metadata } from "next";
import Link from "next/link";

import { CampaignBrowseGrid } from "@/components/campaigns/campaign-browse-grid";
import { DashboardPageShell } from "@/components/dashboard/dashboard-page-shell";
import { Button } from "@/components/ui/button";
import { SITE_NAME } from "@/lib/brand";
import { listBrowseableCampaigns } from "@/lib/services/public-campaigns";

export const metadata: Metadata = {
  title: "Marchés",
  description: `Parcourez les campagnes en direct et financées sur ${SITE_NAME}.`,
};

export default async function DashboardMarketsPage() {
  const campaigns = await listBrowseableCampaigns();

  return (
    <DashboardPageShell
      eyebrow="Découvrir"
      title="Marchés"
      description="Toutes les campagnes que vous pouvez ouvrir, sauvegarder ou dans lesquelles vous pouvez investir. Les filtres et la recherche correspondent à l'expérience de navigation publique."
      actions={
        <Button variant="outline" size="sm" asChild className="border-black/15">
          <Link href="/campaigns">Ouvrir la navigation publique</Link>
        </Button>
      }
    >
      <CampaignBrowseGrid campaigns={campaigns} loginCallbackPath="/dashboard/markets" />
    </DashboardPageShell>
  );
}
