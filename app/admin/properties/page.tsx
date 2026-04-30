"use client";

import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

import { MockQueryPlaceholder } from "@/components/mock-query-placeholder";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";

export default function AdminPropertiesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // TODO: Replace with actual API hook when properties backend is ready
  const isPending = false;
  const isError = false;
  const data = { items: [], total: 0 };
  const pageCount = Math.max(1, Math.ceil((data?.total ?? 0) / pageSize));

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:py-6 lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Properties</h1>
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search properties"
            className="h-9 w-72 rounded-md bg-white"
          />
          <Button
            type="button"
            size="sm"
            className="rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => toast.info("New property flow coming soon.")}
          >
            <PlusIcon className="size-4" />
            New property
          </Button>
        </div>
      </div>

      <MockQueryPlaceholder
        isPending={isPending}
        isError={isError}
        onRetry={() => {}}
      />

      {!isPending && !isError && data ? (
        <div className="rounded-lg border bg-white p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Properties module coming soon. This will manage tokenized real
            estate listings.
          </p>
        </div>
      ) : null}

      {!isPending && !isError && data && data.total > 0 ? (
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8"
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
            className="size-8"
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
