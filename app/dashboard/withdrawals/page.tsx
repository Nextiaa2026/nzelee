"use client";

import { InvestorWithdrawalsTable } from "@/components/dashboard/tables/investor-withdrawals-table";
import { WithdrawalRequestForm } from "@/components/forms/withdrawal-request-form";
import { MockQueryPlaceholder } from "@/components/mock-query-placeholder";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMockInvestorWithdrawals } from "@/hooks/use-mock-investor-queries";

export default function DashboardWithdrawalsPage() {
  const { data, isPending, isError, refetch } = useMockInvestorWithdrawals();

  return (
    <div className="flex flex-col gap-4">
      <Card className="border-0 shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Withdrawals</CardTitle>
          <CardDescription>
            Cash or wallet withdrawals you have requested. React Query mock until payouts are live.
          </CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Request a withdrawal</CardTitle>
          <CardDescription>
            Demo form — connect to payouts when your ledger is ready.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WithdrawalRequestForm />
        </CardContent>
      </Card>
      <MockQueryPlaceholder
        isPending={isPending}
        isError={isError}
        onRetry={() => void refetch()}
      />
      {!isPending && !isError && data ? <InvestorWithdrawalsTable data={data} /> : null}
    </div>
  );
}
