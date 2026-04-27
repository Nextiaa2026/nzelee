"use client";

import { AdminInvestmentsTable } from "@/components/admin/tables/admin-investments-table";
import { MockQueryPlaceholder } from "@/components/mock-query-placeholder";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAdminPledges } from "@/hooks/use-admin-queries";

export default function AdminInvestmentsPage() {
  const { data, isPending, isError, refetch } = useAdminPledges();

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:py-6 lg:px-6">
      <Card className="border-0 shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Investments</CardTitle>
          <CardDescription>
            Investor commitments from the live admin API.
          </CardDescription>
        </CardHeader>
      </Card>
      <MockQueryPlaceholder
        isPending={isPending}
        isError={isError}
        onRetry={() => void refetch()}
      />
      {!isPending && !isError && data ? <AdminInvestmentsTable data={data} /> : null}
    </div>
  );
}
