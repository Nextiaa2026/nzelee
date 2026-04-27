"use client";

import { AdminKycSubmissionsTable } from "@/components/admin/tables/admin-kyc-submissions-table";
import { MockQueryPlaceholder } from "@/components/mock-query-placeholder";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAdminKycSubmissions } from "@/hooks/use-admin-queries";

export default function AdminKycPage() {
  const { data, isPending, isError, refetch } = useAdminKycSubmissions();

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:py-6 lg:px-6">
      <Card className="border-0 shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle>KYC Reviews</CardTitle>
          <CardDescription>
            Review and approve or reject user KYC submissions.
          </CardDescription>
        </CardHeader>
      </Card>
      <MockQueryPlaceholder
        isPending={isPending}
        isError={isError}
        onRetry={() => void refetch()}
      />
      {!isPending && !isError && data ? <AdminKycSubmissionsTable data={data} /> : null}
    </div>
  );
}
