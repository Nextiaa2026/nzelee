import Link from "next/link";

import { SavedCampaignsClient } from "@/app/dashboard/saved/saved-campaigns-client";
import { DashboardPageShell } from "@/components/dashboard/dashboard-page-shell";
import { Button } from "@/components/ui/button";

export default function SavedCampaignsPage() {
  return (
    <DashboardPageShell
      eyebrow="Favoris"
      title="Campagnes sauvegardées"
      description="Campagnes que vous souhaitez suivre ou consulter plus tard."
      actions={
        <Button variant="secondary" size="sm" asChild>
          <Link href="/campaigns">Parcourir les campagnes</Link>
        </Button>
      }
    >
      <SavedCampaignsClient />
    </DashboardPageShell>
  );
}
