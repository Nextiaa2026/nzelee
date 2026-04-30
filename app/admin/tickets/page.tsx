"use client";

import { AdminTicketsPanel } from "@/components/admin/admin-tickets-panel";

export default function AdminTicketsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:py-6 lg:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Support Tickets</h1>
      <AdminTicketsPanel />
    </div>
  );
}
