"use client";

import { AdminTransactionsTable } from "@/components/admin/tables/admin-transactions-table";
import { MockQueryPlaceholder } from "@/components/mock-query-placeholder";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAdminTransactions } from "@/hooks/use-admin-queries";

export default function AdminTransactionsPage() {
  const { data, isPending, isError, refetch } = useAdminTransactions();

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:py-6 lg:px-6">
      <Card className="border-0 shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            Charges, refunds, payouts, and provider events from the live API.
          </CardDescription>
        </CardHeader>
      </Card>
      <MockQueryPlaceholder
        isPending={isPending}
        isError={isError}
        onRetry={() => void refetch()}
      />
      {!isPending && !isError && data ? <AdminTransactionsTable data={data} /> : null}
    </div>
  );
}
