"use client";

import { InvestorInvestmentsTable } from "@/components/dashboard/tables/investor-investments-table";
import { InvestmentCommitmentForm } from "@/components/forms/investment-commitment-form";
import { MockQueryPlaceholder } from "@/components/mock-query-placeholder";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMockInvestorInvestments } from "@/hooks/use-mock-investor-queries";

export default function DashboardInvestmentsPage() {
  const { data, isPending, isError, refetch } = useMockInvestorInvestments();

  return (
    <div className="flex flex-col gap-4">
      <Card className="border-0 shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Investments</CardTitle>
          <CardDescription>
            Your commitments to listings. React Query mock — replace with pledges API when wired.
          </CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">New commitment</CardTitle>
          <CardDescription>
            Demo form — wire to your investment API when listings are public.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InvestmentCommitmentForm />
        </CardContent>
      </Card>
      <MockQueryPlaceholder
        isPending={isPending}
        isError={isError}
        onRetry={() => void refetch()}
      />
      {!isPending && !isError && data ? <InvestorInvestmentsTable data={data} /> : null}
    </div>
  );
}
