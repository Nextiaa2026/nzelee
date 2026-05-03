"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type AdminDataTableProps<TData extends { id: string }> = {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  className?: string;
  /** When false, hides checkboxes and selection footer (e.g. investor dashboard). */
  enableRowSelection?: boolean;
};

export function AdminDataTable<TData extends { id: string }>({
  columns,
  data,
  className,
  enableRowSelection = true,
}: AdminDataTableProps<TData>) {
  const [rowSelection, setRowSelection] = React.useState({});

  const selectColumn = React.useMemo<ColumnDef<TData, unknown>>(
    () => ({
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllRowsSelected()
                ? true
                : table.getIsSomeRowsSelected()
                  ? "indeterminate"
                  : false
            }
            onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
            aria-label="Select all rows"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    }),
    [],
  );

  const tableColumns = React.useMemo(
    () => (enableRowSelection ? [selectColumn, ...columns] : columns),
    [enableRowSelection, selectColumn, columns],
  );

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: { rowSelection },
    enableRowSelection,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  });

  const colSpan = columns.length + (enableRowSelection ? 1 : 0);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="overflow-x-auto rounded-lg border border-foreground/10 bg-card">
        <Table className="min-w-full [&_tr]:border-b [&_tr]:border-border/30">
          <TableHeader className="bg-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="hover:bg-transparent border-b-2 border-foreground/10"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className="h-12 px-4 font-semibold text-foreground/90"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  className="transition-colors hover:bg-surface-muted/30"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4 px-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={colSpan}
                  className="h-32 text-center text-muted-foreground"
                >
                  No rows.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {enableRowSelection ? (
        <p className="text-sm text-foreground/60">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getRowModel().rows.length} row(s) selected. All rows load on
          the client (no server-side pagination).
        </p>
      ) : (
        <p className="text-sm text-foreground/60">
          {table.getRowModel().rows.length} row(s). Client-side list (no server
          pagination).
        </p>
      )}
    </div>
  );
}
