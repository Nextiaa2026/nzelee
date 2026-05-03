"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontalIcon } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

import { AdminDataTable } from "@/components/admin-data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { formatDateLong } from "@/lib/format/date";
import type { AdminUsersListResponse } from "@/types/api/admin";

type AdminUserRow = AdminUsersListResponse["items"][number];

export function AdminUsersTable({ data }: { data: AdminUserRow[] }) {
  const qc = useQueryClient();
  const copyText = async (value: string, label: string) => {
    await navigator.clipboard.writeText(value);
    toast.success(`${label} copié`);
  };

  const patchRoleMut = useMutation({
    mutationFn: ({
      id,
      role,
    }: {
      id: string;
      role: "USER" | "CREATOR" | "ADMIN";
    }) => adminPatchUser(id, { role }),
    onSuccess: async (res) => {
      if (!isApiSuccess(res)) {
        toast.error(res.error.message);
        return;
      }
      toast.success("Rôle de l'utilisateur mis à jour");
      await qc.invalidateQueries({ queryKey: adminQueryKeys.all });
    },
    onError: () => toast.error("Échec de la mise à jour du rôle"),
  });

  const columns = useMemo<ColumnDef<AdminUserRow, unknown>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nom",
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
        header: "Inscrit le",
        cell: ({ row }) => formatDateLong(row.original.createdAt),
      },
      {
        accessorKey: "lastLoginAt",
        header: "Dernière connexion",
        cell: ({ row }) =>
          row.original.lastLoginAt ? formatDateLong(row.original.lastLoginAt) : "Jamais",
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="size-8"
              >
                <MoreHorizontalIcon className="size-4" />
                <span className="sr-only">Open actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <a href={`mailto:${row.original.email}`}>Envoyer un email</a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => void copyText(row.original.id, "ID utilisateur")}
              >
                Copier l&apos;ID utilisateur
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => void copyText(row.original.email, "Email")}
              >
                Copier l&apos;email
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [patchRoleMut],
  );

  return <AdminDataTable columns={columns} data={data} />;
}
