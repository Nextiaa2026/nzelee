"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useMemo } from "react";

import { AdminDataTable } from "@/components/admin-data-table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isApiSuccess } from "@/lib/http/api-result";
import { adminQueryKeys } from "@/lib/query-keys/admin";
import { adminPatchUser } from "@/lib/services/admin-rest";
import type { AdminUsersListResponse } from "@/types/api/admin";

type AdminUserRow = AdminUsersListResponse["items"][number];

export function AdminUsersTable({ data }: { data: AdminUserRow[] }) {
  const qc = useQueryClient();

  const patchRoleMut = useMutation({
    mutationFn: ({ id, role }: { id: string; role: "USER" | "CREATOR" | "ADMIN" }) =>
      adminPatchUser(id, { role }),
    onSuccess: async (res) => {
      if (!isApiSuccess(res)) {
        toast.error(res.error.message);
        return;
      }
      toast.success("User role updated");
      await qc.invalidateQueries({ queryKey: adminQueryKeys.all });
    },
    onError: () => toast.error("Failed to update user role"),
  });

  const columns = useMemo<ColumnDef<AdminUserRow, unknown>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => row.original.name ?? "—",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-normal">
              {row.original.role}
            </Badge>
            <Select
              value={row.original.role}
              onValueChange={(nextRole) =>
                patchRoleMut.mutate({
                  id: row.original.id,
                  role: nextRole as "USER" | "CREATOR" | "ADMIN",
                })
              }
            >
              <SelectTrigger className="h-8 w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">USER</SelectItem>
                <SelectItem value="CREATOR">CREATOR</SelectItem>
                <SelectItem value="ADMIN">ADMIN</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Joined",
        cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
      },
    ],
    [patchRoleMut],
  );

  return <AdminDataTable columns={columns} data={data} />;
}
