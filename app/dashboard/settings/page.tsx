import { ProfileSettingsForm } from "@/components/forms/profile-settings-form";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";

export default async function DashboardSettingsPage() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update how your name appears across Nexiaa.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Display name and organization are stored on your account.</CardDescription>
        </CardHeader>
        <div className="px-6 pb-6">
          <ProfileSettingsForm
            email={session.user.email ?? ""}
            defaultName={session.user.name ?? ""}
            defaultOrganization={session.user.organization ?? ""}
          />
        </div>
      </Card>
    </div>
  );
}
