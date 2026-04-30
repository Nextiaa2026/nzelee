import type { Metadata } from "next";

import { DashboardPageShell } from "@/components/dashboard/dashboard-page-shell";
import { NotificationsPanel } from "@/components/dashboard/notifications-panel";

export const metadata: Metadata = {
  title: "Notifications",
  description: "Your account notifications.",
};

export default function DashboardNotificationsPage() {
  return (
    <DashboardPageShell
      eyebrow="Inbox"
      title="Notifications"
      description="Read and dismiss updates about your profile, verification, and activity."
    >
      <NotificationsPanel />
    </DashboardPageShell>
  );
}
