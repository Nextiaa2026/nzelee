import { AdminCampaignsPanel } from "@/components/admin/admin-campaigns-panel";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminCampaignsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:py-6 lg:px-6">
      <Card className="border-0 shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Listings</CardTitle>
          <CardDescription>
            Create and manage investable projects. Cover images are stored in Cloudinary when you
            upload from the form.
          </CardDescription>
        </CardHeader>
      </Card>
      <AdminCampaignsPanel />
    </div>
  );
}
