"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";

import { AdminWithdrawalsTable } from "@/components/admin/tables/admin-withdrawals-table";
import { MockQueryPlaceholder } from "@/components/mock-query-placeholder";
import { Button } from "@/components/ui/button";
import { useAdminWithdrawalRequests } from "@/hooks/use-admin-queries";

export default function AdminWithdrawalsPage() {
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const { data, isPending, isError, refetch } = useAdminWithdrawalRequests(page, pageSize);
  const pageCount = Math.max(1, Math.ceil((data?.total ?? 0) / pageSize));

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:py-6 lg:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Withdrawals</h1>
      <MockQueryPlaceholder
        isPending={isPending}
        isError={isError}
        onRetry={() => void refetch()}
      />
      {!isPending && !isError && data ? <AdminWithdrawalsTable data={data.items} /> : null}
      {!isPending && !isError && data ? (
        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="outline" size="icon" className="size-8" aria-label="Previous page" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            <ChevronLeftIcon className="size-4" />
          </Button>
          <p className="text-xs text-black/60">Page {page} of {pageCount}</p>
          <Button type="button" variant="outline" size="icon" className="size-8" aria-label="Next page" disabled={page >= pageCount} onClick={() => setPage((p) => Math.min(pageCount, p + 1))}>
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
