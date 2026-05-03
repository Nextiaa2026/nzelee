import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { ProjectsCrudModule } from "@/components/dashboard/projects-crud-module";
import { listMyCampaignProjects } from "@/lib/services/user-projects";

export const metadata: Metadata = {
  title: "Projets",
  description: "Gérez les annonces que vous publiez en tant qu'administrateur.",
};

type ProjectsPageProps = {
  searchParams?: Promise<{
    mode?: string;
    campaignId?: string;
  }>;
};

export default async function DashboardProjectsPage({ searchParams }: ProjectsPageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const rows = await listMyCampaignProjects(session.user.id);
  const params = searchParams ? await searchParams : undefined;
  const requestedMode =
    params?.mode === "new" ? "create" : params?.campaignId ? "update" : null;

  return (
    <ProjectsCrudModule
      campaigns={rows}
      initialMode={requestedMode}
      initialCampaignId={params?.campaignId ?? null}
    />
  );
}
