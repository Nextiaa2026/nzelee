"use client";

import { useAdminStatsSummary, useAdminStatsTimeseries } from "@/hooks/use-admin-queries";
import { formatCentsToUsd } from "@/lib/money";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminDashboardStats() {
  const { data: summary, isPending, isError, error } = useAdminStatsSummary();
  const { data: series } = useAdminStatsTimeseries("90d");

  if (isError) {
    return (
      <p className="px-4 text-sm text-destructive lg:px-6">
        {error?.message ?? "Failed to load dashboard stats"}
      </p>
    );
  }
  if (isPending || !summary) {
    return (
      <div className="space-y-4 px-4 lg:px-6">
        <div className="grid grid-cols-2 gap-4 @5xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[320px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <>
      <SectionCards
        totalUsers={summary.users.total}
        totalCampaigns={summary.campaigns.total}
        paidPledgeDisplay={formatCentsToUsd(summary.totalPaidPledgeAmount)}
        pendingPipeline={summary.pipeline.pendingWithdrawals + summary.pipeline.pendingPledges}
        pendingDetail={`${summary.pipeline.pendingWithdrawals} withdrawal · ${summary.pipeline.pendingPledges} pledge`}
      />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive
          dataPoints={series?.points}
          defaultRange="90d"
        />
      </div>
    </>
  );
}
