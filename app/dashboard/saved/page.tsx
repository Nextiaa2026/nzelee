import Link from "next/link";

import { SavedCampaignsClient } from "@/app/dashboard/saved/saved-campaigns-client";
import { DashboardPageShell } from "@/components/dashboard/dashboard-page-shell";
import { Button } from "@/components/ui/button";

export default function SavedCampaignsPage() {
  return (
    <DashboardPageShell
      eyebrow="Bookmarks"
      title="Saved campaigns"
      description="Bookmarks for campaigns you want to follow or revisit later."
      actions={
        <Button variant="secondary" size="sm" asChild>
          <Link href="/campaigns">Browse campaigns</Link>
        </Button>
      }
    >
      <SavedCampaignsClient />
    </DashboardPageShell>
  );
}
