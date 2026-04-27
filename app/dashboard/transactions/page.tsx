"use client";

import { InvestorTransactionsTable } from "@/components/dashboard/tables/investor-transactions-table";
import { MockQueryPlaceholder } from "@/components/mock-query-placeholder";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMockInvestorTransactions } from "@/hooks/use-mock-investor-queries";

export default function DashboardTransactionsPage() {
  const { data, isPending, isError, refetch } = useMockInvestorTransactions();

  return (
    <div className="flex flex-col gap-4">
      <Card className="border-0 shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            Charges, refunds, and fees for your account. Loaded with React Query (mock); swap the
            hook for your ledger API.
          </CardDescription>
        </CardHeader>
      </Card>
      <MockQueryPlaceholder
        isPending={isPending}
        isError={isError}
        onRetry={() => void refetch()}
      />
      {!isPending && !isError && data ? <InvestorTransactionsTable data={data} /> : null}
    </div>
  );
}
