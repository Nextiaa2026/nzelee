"use client";

import { DashboardPageShell } from "@/components/dashboard/dashboard-page-shell";
import { InvestorTransactionsTable } from "@/components/dashboard/tables/investor-transactions-table";
import { MockQueryPlaceholder } from "@/components/mock-query-placeholder";
import { useMockInvestorTransactions } from "@/hooks/use-mock-investor-queries";

export default function DashboardTransactionsPage() {
  const { data, isPending, isError, refetch } = useMockInvestorTransactions();

  return (
    <DashboardPageShell
      eyebrow="Activity"
      title="Transactions"
      description="Charges, refunds, and fees for your account. Loaded with React Query (mock); swap the hook for your ledger API."
    >
      <MockQueryPlaceholder
        isPending={isPending}
        isError={isError}
        onRetry={() => void refetch()}
      />
      {!isPending && !isError && data ? <InvestorTransactionsTable data={data} /> : null}
    </DashboardPageShell>
  );
}
