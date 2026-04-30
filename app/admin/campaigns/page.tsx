import { AdminCampaignsPanel } from "@/components/admin/admin-campaigns-panel";

export default function AdminCampaignsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:py-6 lg:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Listings</h1>
      <AdminCampaignsPanel />
    </div>
  );
}
