"use client";

import { DashboardPageShell } from "@/components/dashboard/dashboard-page-shell";
import { InvestorWithdrawalsTable } from "@/components/dashboard/tables/investor-withdrawals-table";
import { WithdrawalRequestSheet } from "@/components/dashboard/withdrawal-request-sheet";
import { MockQueryPlaceholder } from "@/components/mock-query-placeholder";
import { useUserWithdrawals } from "@/hooks/use-user-withdrawals";

export default function DashboardWithdrawalsPage() {
  const { data, isPending, isError, refetch } = useUserWithdrawals();

  return (
    <DashboardPageShell
      eyebrow="Trésorerie"
      title="Retraits"
      description="Retirez vos fonds vers votre banque ou portefeuille numérique. Les demandes restent en attente jusqu'à ce qu'un administrateur les approuve ou les rejette."
      actions={<WithdrawalRequestSheet />}
    >
      <MockQueryPlaceholder
        isPending={isPending}
        isError={isError}
        onRetry={() => void refetch()}
      />
      {!isPending && !isError && data ? <InvestorWithdrawalsTable data={data} /> : null}
    </DashboardPageShell>
  );
}
