"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

import { AdminDataTable } from "@/components/admin-data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isApiSuccess } from "@/lib/http/api-result";
import { formatCentsToUsd } from "@/lib/money";
import { adminQueryKeys } from "@/lib/query-keys/admin";
import { adminDeleteProperty, adminPatchProperty } from "@/lib/services/admin-rest";
import type { AdminPropertyListRow } from "@/types/api/admin";

export function AdminPropertiesTable({ data }: { data: AdminPropertyListRow[] }) {
  const qc = useQueryClient();

  const patchMut = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "DRAFT" | "ACTIVE" | "PAUSED" | "SOLD" | "CLOSED";
    }) => adminPatchProperty(id, { status }),
    onSuccess: async (res) => {
      if (!isApiSuccess(res)) {
        toast.error(res.error.message);
        return;
      }
      toast.success("Property updated");
      await qc.invalidateQueries({ queryKey: adminQueryKeys.properties() });
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => adminDeleteProperty(id),
    onSuccess: async (res) => {
      if (!isApiSuccess(res)) {
        toast.error(res.error.message);
        return;
      }
      toast.success("Property deleted");
      await qc.invalidateQueries({ queryKey: adminQueryKeys.properties() });
    },
  });

  const columns = useMemo<ColumnDef<AdminPropertyListRow, unknown>[]>(
    () => [
      { accessorKey: "name", header: "Property" },
      {
        accessorKey: "slug",
        header: "Slug",
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground">{row.original.slug}</span>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Badge variant="outline">{row.original.status}</Badge>
            <Select
              value={row.original.status}
              onValueChange={(status) =>
                patchMut.mutate({
                  id: row.original.id,
                  status: status as "DRAFT" | "ACTIVE" | "PAUSED" | "SOLD" | "CLOSED",
                })
              }
            >
              <SelectTrigger className="h-8 w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">DRAFT</SelectItem>
                <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                <SelectItem value="PAUSED">PAUSED</SelectItem>
                <SelectItem value="SOLD">SOLD</SelectItem>
                <SelectItem value="CLOSED">CLOSED</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ),
      },
      {
        accessorKey: "appraisedValue",
        header: "Value",
        cell: ({ row }) =>
          row.original.appraisedValue
            ? formatCentsToUsd(row.original.appraisedValue)
            : "—",
      },
      {
        accessorKey: "country",
        header: "Country",
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => deleteMut.mutate(row.original.id)}
            aria-label="Delete property"
          >
            <Trash2Icon className="size-4 text-destructive" />
          </Button>
        ),
      },
    ],
    [deleteMut, patchMut],
  );

  return <AdminDataTable columns={columns} data={data} />;
}
