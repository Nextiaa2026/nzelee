"use client";

import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { AddUserSheet } from "@/components/admin/add-user-sheet";
import { AdminUsersTable } from "@/components/admin/tables/admin-users-table";
import { MockQueryPlaceholder } from "@/components/mock-query-placeholder";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminUsers } from "@/hooks/use-admin-queries";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState<
    "ALL" | "USER" | "CREATOR" | "ADMIN"
  >("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const { data, isPending, isError, refetch } = useAdminUsers(
    page,
    pageSize,
    search,
  );
  const filteredItems = useMemo(() => {
    const rows = data?.items ?? [];
    return rows.filter((row) => {
      const matchesRole = roleFilter === "ALL" || row.role === roleFilter;
      return matchesRole;
    });
  }, [data?.items, roleFilter]);
  const pageCount = Math.max(1, Math.ceil((data?.total ?? 0) / pageSize));

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:py-6 lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Utilisateurs</h1>
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Rechercher par nom ou email"
            className="h-9 w-72 rounded-md bg-white"
          />
          <Select
            value={roleFilter}
            onValueChange={(value) => {
              setRoleFilter(value as "ALL" | "USER" | "CREATOR" | "ADMIN");
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-36 rounded-md bg-white">
              <SelectValue placeholder="Rôle" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="ALL">Tous les rôles</SelectItem>
              <SelectItem value="USER">UTILISATEUR</SelectItem>
              <SelectItem value="CREATOR">CRÉATEUR</SelectItem>
              <SelectItem value="ADMIN">ADMIN</SelectItem>
            </SelectContent>
          </Select>
          <Button
            type="button"
            size="sm"
            className="rounded-md bg-mint text-mint-foreground hover:bg-mint/90"
            onClick={() => setAddUserOpen(true)}
          >
            <PlusIcon className="size-4" />
            Nouvel utilisateur
          </Button>
          <AddUserSheet 
            open={addUserOpen} 
            onOpenChange={setAddUserOpen} 
            onSuccess={() => void refetch()}
          />
        </div>
      </div>
      <MockQueryPlaceholder
        isPending={isPending}
        isError={isError}
        onRetry={() => void refetch()}
      />
      {!isPending && !isError && data ? (
        <AdminUsersTable data={filteredItems} />
      ) : null}
      {!isPending && !isError && data ? (
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
