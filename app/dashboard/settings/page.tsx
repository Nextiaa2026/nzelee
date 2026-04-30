import { ProfileSettingsForm } from "@/components/forms/profile-settings-form";
import { DashboardPageShell } from "@/components/dashboard/dashboard-page-shell";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function DashboardSettingsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }
  const [user] = await db
    .select({
      dateOfBirth: users.dateOfBirth,
      country: users.country,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  return (
    <DashboardPageShell
      eyebrow="Account"
      title="Profile & settings"
      description="Update your profile details used across your account."
    >
      <Card className="border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Keep your profile current for onboarding, verification, and investor updates.
          </CardDescription>
        </CardHeader>
        <div className="px-6 pb-6">
          <ProfileSettingsForm
            email={session.user.email ?? ""}
            defaultName={session.user.name ?? ""}
            defaultOrganization={session.user.organization ?? ""}
            defaultCountry={user?.country ?? ""}
            defaultDateOfBirth={
              user?.dateOfBirth ? user.dateOfBirth.toISOString().slice(0, 10) : ""
            }
          />
        </div>
      </Card>
    </DashboardPageShell>
  );
}
