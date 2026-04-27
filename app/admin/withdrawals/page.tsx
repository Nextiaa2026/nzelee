"use client";

import { AdminWithdrawalsTable } from "@/components/admin/tables/admin-withdrawals-table";
import { MockQueryPlaceholder } from "@/components/mock-query-placeholder";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAdminWithdrawalRequests } from "@/hooks/use-admin-queries";

export default function AdminWithdrawalsPage() {
  const { data, isPending, isError, refetch } = useAdminWithdrawalRequests();

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:py-6 lg:px-6">
      <Card className="border-0 shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Withdrawals</CardTitle>
          <CardDescription>
            Manage payout requests and update their status from the admin API.
          </CardDescription>
        </CardHeader>
      </Card>
      <MockQueryPlaceholder
        isPending={isPending}
        isError={isError}
        onRetry={() => void refetch()}
      />
      {!isPending && !isError && data ? <AdminWithdrawalsTable data={data} /> : null}
    </div>
  );
}
