"use client";

import { AdminNotificationsPanel } from "@/components/admin/admin-notifications-panel";

export default function AdminNotificationsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:py-6 lg:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
      <AdminNotificationsPanel />
    </div>
  );
}
