"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Download,
  Search,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AdminTransactionsTable } from "@/components/admin/tables/admin-transactions-table";
import { MockQueryPlaceholder } from "@/components/mock-query-placeholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { useAdminTransactions } from "@/hooks/use-admin-queries";

export default function AdminTransactionsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const pageSize = 20;
  const { data, isPending, isError, refetch } = useAdminTransactions(
    page,
    pageSize,
    search,
    startDate?.toISOString().split("T")[0] || "",
    endDate?.toISOString().split("T")[0] || "",
  );
  const pageCount = Math.max(1, Math.ceil((data?.total ?? 0) / pageSize));

  const handleExport = () => {
    if (!data?.items || data.items.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = [
      "ID",
      "Amount",
      "Currency",
      "Status",
      "Type",
      "Campaign",
      "Date",
    ];
    const csvContent = [
      headers.join(","),
      ...data.items.map((tx) =>
        [
          tx.id,
          tx.amount / 100,
          tx.currency,
          tx.status,
          tx.type,
          tx.campaignTitle,
          tx.createdAt,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `transactions_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported successfully");
  };

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:py-6 lg:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Transactions</h1>
        <Button
          variant="outline"
          onClick={handleExport}
          className="gap-2 rounded-md"
          disabled={isPending || !data?.items.length}
        >
          <Download className="size-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-black/40" />
          <Input
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="rounded-md pl-9 bg-white"
          />
        </div>
        <DatePicker
          date={startDate}
          onDateChange={(date) => {
            setStartDate(date);
            setPage(1);
          }}
          placeholder="Start Date"
          className="rounded-md bg-white"
        />
        <DatePicker
          date={endDate}
          onDateChange={(date) => {
            setEndDate(date);
            setPage(1);
          }}
          placeholder="End Date"
          className="rounded-md bg-white"
        />
        <Button
          variant="secondary"
          onClick={() => {
            setSearch("");
            setStartDate(undefined);
            setEndDate(undefined);
            setPage(1);
          }}
          className="rounded-md bg-white"
        >
          Clear Filters
        </Button>
      </div>

      <MockQueryPlaceholder
        isPending={isPending}
        isError={isError}
        onRetry={() => void refetch()}
      />

      {!isPending && !isError && data ? (
        <AdminTransactionsTable data={data.items} />
      ) : null}

      {!isPending && !isError && data ? (
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8 rounded-lg"
            aria-label="Previous page"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
          <p className="text-xs text-black/60">
            Page {page} of {pageCount}
          </p>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8 rounded-lg"
            aria-label="Next page"
            disabled={page >= pageCount}
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
