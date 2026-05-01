"use client";

import { useState } from "react";

import { DashboardPageShell } from "@/components/dashboard/dashboard-page-shell";
import { InvestorTransactionsTable } from "@/components/dashboard/tables/investor-transactions-table";
import { MockQueryPlaceholder } from "@/components/mock-query-placeholder";
import { useMockInvestorTransactionsPaginated } from "@/hooks/use-mock-investor-queries";

export default function DashboardTransactionsPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, isPending, isError, refetch } =
    useMockInvestorTransactionsPaginated({ page, pageSize });

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
      {!isPending && !isError && data ? (
        <InvestorTransactionsTable
          data={data.items}
          page={data.page}
          pageSize={data.pageSize}
          total={data.total}
          onPageChange={setPage}
        />
      ) : null}
    </DashboardPageShell>
  );
}
