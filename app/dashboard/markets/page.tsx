import type { Metadata } from "next";
import Link from "next/link";

import { CampaignBrowseGrid } from "@/components/campaigns/campaign-browse-grid";
import { DashboardPageShell } from "@/components/dashboard/dashboard-page-shell";
import { Button } from "@/components/ui/button";
import { SITE_NAME } from "@/lib/brand";
import { listBrowseableCampaigns } from "@/lib/services/public-campaigns";

export const metadata: Metadata = {
  title: "Markets",
  description: `Browse live and funded campaigns on ${SITE_NAME}.`,
};

export default async function DashboardMarketsPage() {
  const campaigns = await listBrowseableCampaigns();

  return (
    <DashboardPageShell
      eyebrow="Discover"
      title="Markets"
      description="All campaigns you can open, save, or invest in. Filters and search match the public browse experience."
      actions={
        <Button variant="outline" size="sm" asChild className="border-black/15">
          <Link href="/campaigns">Open public browse</Link>
        </Button>
      }
    >
      <CampaignBrowseGrid campaigns={campaigns} loginCallbackPath="/dashboard/markets" />
    </DashboardPageShell>
  );
}
