"use client";

import { AdminPropertiesTable } from "@/components/admin/tables/admin-properties-table";
import { MockQueryPlaceholder } from "@/components/mock-query-placeholder";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isApiSuccess } from "@/lib/http/api-result";
import { adminCreateProperty } from "@/lib/services/admin-rest";
import { useAdminProperties } from "@/hooks/use-admin-queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function AdminPropertiesPage() {
  const qc = useQueryClient();
  const { data, isPending, isError, refetch } = useAdminProperties();

  const createMut = useMutation({
    mutationFn: () =>
      adminCreateProperty({
        name: `Property ${Date.now()}`,
        country: "US",
        status: "DRAFT",
        type: "RESIDENTIAL",
        currency: "USD",
      }),
    onSuccess: async (res) => {
      if (!isApiSuccess(res)) {
        toast.error(res.error.message);
        return;
      }
      toast.success("Property created");
      await qc.invalidateQueries({ queryKey: ["admin", "properties"] });
    },
  });

  const rows = data ?? [];

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:py-6 lg:px-6">
      <Card className="border-0 shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Properties</CardTitle>
          <CardDescription>
            Create and manage property records users can invest in.
          </CardDescription>
        </CardHeader>
      </Card>
      <div>
        <Button type="button" size="sm" onClick={() => createMut.mutate()}>
          Create property
        </Button>
      </div>
      <MockQueryPlaceholder
        isPending={isPending}
        isError={isError}
        onRetry={() => void refetch()}
      />
      {!isPending && !isError && rows ? <AdminPropertiesTable data={rows} /> : null}
    </div>
  );
}
