import Link from "next/link";
import { desc, eq } from "drizzle-orm";

import { AdminDashboardStats } from "@/components/admin/admin-dashboard-stats";
import { db } from "@/lib/db";
import { campaigns } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function formatMoney(amountMinor: number, currency: string) {
  return (amountMinor / 100).toLocaleString(undefined, {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 0,
  });
}

export default async function AdminOverviewPage() {
  const featuredCampaigns = await db
    .select({
      id: campaigns.id,
      title: campaigns.title,
      slug: campaigns.slug,
      summary: campaigns.summary,
      coverImageUrl: campaigns.coverImageUrl,
      raisedAmount: campaigns.raisedAmount,
      goalAmount: campaigns.goalAmount,
      currency: campaigns.currency,
      status: campaigns.status,
    })
    .from(campaigns)
    .where(eq(campaigns.isFeatured, true))
    .orderBy(desc(campaigns.updatedAt))
    .limit(4);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-semibold tracking-tight">Administration</h1>
          </div>
          <AdminDashboardStats />
          <div className="px-4 lg:px-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-lg font-medium">Campagnes à la une</h2>
              <Button asChild size="sm" variant="outline">
                <Link href="/admin/campaigns">Gérer les annonces</Link>
              </Button>
            </div>
            {featuredCampaigns.length ? (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {featuredCampaigns.map((campaign) => {
                  const progress =
                    campaign.goalAmount > 0
                      ? Math.min(
                          100,
                          Math.round(
                            (campaign.raisedAmount / campaign.goalAmount) * 100,
                          ),
                        )
                      : 0;
                  return (
                    <Card key={campaign.id} className="overflow-hidden shadow-none">
                      <div className="relative h-28 bg-black/5">
                        {campaign.coverImageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={campaign.coverImageUrl}
                            alt={campaign.title}
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                      <CardHeader className="space-y-1">
                        <CardTitle className="line-clamp-1 text-base">
                          {campaign.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {campaign.summary}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-black/60">
                          <span>{campaign.status}</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-black/10">
                          <div
                            className="h-full bg-mint"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-black/75">
                            {formatMoney(campaign.raisedAmount, campaign.currency)}
                          </span>
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/campaigns/${campaign.slug}`}>Ouvrir</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="shadow-none">
                <CardContent className="p-6 text-sm text-black/60">
                  Aucune campagne à la une pour le moment.
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
