import type { Metadata } from "next";

import { DashboardPageShell } from "@/components/dashboard/dashboard-page-shell";
import { NotificationsPanel } from "@/components/dashboard/notifications-panel";

export const metadata: Metadata = {
  title: "Notifications",
  description: "Vos notifications de compte.",
};

export default function DashboardNotificationsPage() {
  return (
    <DashboardPageShell
      eyebrow="Boîte de réception"
      title="Notifications"
      description="Lisez et gérez les mises à jour concernant votre profil, votre vérification et votre activité."
    >
      <NotificationsPanel />
    </DashboardPageShell>
  );
}
