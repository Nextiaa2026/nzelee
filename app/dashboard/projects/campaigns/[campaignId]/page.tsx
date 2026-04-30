import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

type Props = { params: Promise<{ campaignId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { campaignId } = await params;
  return { title: `Campaign ${campaignId.slice(0, 8)}…` };
}

export default async function DashboardCampaignDetailPage({ params }: Props): Promise<never> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }
  const { campaignId } = await params;
  redirect(`/dashboard/projects?campaignId=${campaignId}`);
}
