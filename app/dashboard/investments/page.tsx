"use client";

import Link from "next/link";

import { DashboardPageShell } from "@/components/dashboard/dashboard-page-shell";
import { InvestorInvestmentsTable } from "@/components/dashboard/tables/investor-investments-table";
import { MockQueryPlaceholder } from "@/components/mock-query-placeholder";
import { Button } from "@/components/ui/button";
import { useUserInvestments } from "@/hooks/use-user-investments";

export default function DashboardInvestmentsPage() {
  const { data, isPending, isError, refetch } = useUserInvestments();

  return (
    <DashboardPageShell
      eyebrow="Portfolio"
      title="Investments"
      description="Your commitments across live campaigns in your account."
      actions={
        <Button className="shrink-0 bg-mint text-mint-foreground hover:bg-mint/90" asChild>
          <Link href="/campaigns">New investment</Link>
        </Button>
      }
    >
      <MockQueryPlaceholder
        isPending={isPending}
        isError={isError}
        onRetry={() => void refetch()}
      />
      {!isPending && !isError && data ? <InvestorInvestmentsTable data={data} /> : null}
    </DashboardPageShell>
  );
}
