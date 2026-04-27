"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Loader2Icon, MoreHorizontalIcon, PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { AdminDataTable } from "@/components/admin-data-table";
import { FileDropZone } from "@/components/file-drop-zone";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { isApiSuccess } from "@/lib/http/api-result";
import {
  adminCreateCampaign,
  adminDeleteCampaign,
  adminListCampaigns,
  adminUpdateCampaign,
  type AdminCampaignRow,
} from "@/lib/services/admin";
import { campaignStatusValues } from "@/lib/validations/admin-campaign";
import { cn } from "@/lib/utils";

const textareaClassName = cn(
  "min-h-28 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/45 focus-visible:ring-offset-0 disabled:opacity-50 md:text-sm dark:bg-input/30",
);

const formSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(180),
  slug: z.string().trim().max(220).optional(),
  summary: z.string().trim().min(1).max(320),
  description: z.string().trim().min(1),
  goalDollars: z.number().positive("Goal must be greater than zero"),
  currency: z.string().trim().min(1).max(12),
  status: z.enum(campaignStatusValues),
  coverImageUrl: z.string().optional(),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function toDatetimeLocal(value: Date | string | null | undefined) {
  if (value === null || value === undefined) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const emptyDefaults: FormValues = {
  title: "",
  slug: "",
  summary: "",
  description: "",
  goalDollars: 1000,
  currency: "USD",
  status: "DRAFT",
  coverImageUrl: "",
  startsAt: "",
  endsAt: "",
};

function rowToForm(row: AdminCampaignRow): FormValues {
  return {
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    description: row.description,
    goalDollars: row.goalAmount / 100,
    currency: row.currency,
    status: row.status,
    coverImageUrl: row.coverImageUrl ?? "",
    startsAt: toDatetimeLocal(row.startsAt),
    endsAt: toDatetimeLocal(row.endsAt),
  };
}

function formatMoney(cents: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(2)} ${currency}`;
  }
}

export function AdminCampaignsPanel() {
  const qc = useQueryClient();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["admin", "campaigns"],
    queryFn: adminListCampaigns,
  });

  const rows: AdminCampaignRow[] =
    data && isApiSuccess(data) ? (data.data as AdminCampaignRow[]) : [];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: emptyDefaults,
  });

  const openCreate = () => {
    setEditingId(null);
    form.reset(emptyDefaults);
    setSheetOpen(true);
  };

  function openEdit(row: AdminCampaignRow) {
    setEditingId(row.id);
    form.reset(rowToForm(row));
    setSheetOpen(true);
  }

  const createMut = useMutation({
    mutationFn: adminCreateCampaign,
    onSuccess: (res) => {
      if (isApiSuccess(res)) {
        toast.success("Listing created");
        void qc.invalidateQueries({ queryKey: ["admin", "campaigns"] });
        setSheetOpen(false);
      } else {
        toast.error(res.error.message);
      }
    },
    onError: () => toast.error("Request failed"),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Parameters<typeof adminUpdateCampaign>[1] }) =>
      adminUpdateCampaign(id, body),
    onSuccess: (res) => {
      if (isApiSuccess(res)) {
        toast.success("Listing updated");
        void qc.invalidateQueries({ queryKey: ["admin", "campaigns"] });
        setSheetOpen(false);
      } else {
        toast.error(res.error.message);
      }
    },
    onError: () => toast.error("Request failed"),
  });

  const deleteRow = useCallback(
    async (id: string) => {
      if (!globalThis.confirm("Delete this listing? This cannot be undone.")) return;
      const res = await adminDeleteCampaign(id);
      if (isApiSuccess(res)) {
        toast.success("Listing deleted");
        void qc.invalidateQueries({ queryKey: ["admin", "campaigns"] });
      } else {
        toast.error(res.error.message);
      }
    },
    [qc],
  );

  const onSubmit = form.handleSubmit((values) => {
    const goalAmount = Math.round(values.goalDollars * 100);
    const trimmedCover = values.coverImageUrl?.trim() ?? "";

    if (editingId) {
      updateMut.mutate({
        id: editingId,
        body: {
          title: values.title,
          slug: values.slug?.trim() || undefined,
          summary: values.summary,
          description: values.description,
          goalAmount,
          currency: values.currency.trim(),
          status: values.status,
          coverImageUrl: trimmedCover === "" ? null : trimmedCover,
          startsAt: values.startsAt?.trim()
            ? new Date(values.startsAt).toISOString()
            : null,
          endsAt: values.endsAt?.trim()
            ? new Date(values.endsAt).toISOString()
            : null,
        },
      });
    } else {
      createMut.mutate({
        title: values.title,
        slug: values.slug?.trim() || undefined,
        summary: values.summary,
        description: values.description,
        goalAmount,
        currency: values.currency.trim(),
        status: values.status,
        coverImageUrl: trimmedCover === "" ? undefined : trimmedCover,
        startsAt: values.startsAt?.trim()
          ? new Date(values.startsAt).toISOString()
          : undefined,
        endsAt: values.endsAt?.trim()
          ? new Date(values.endsAt).toISOString()
          : undefined,
      });
    }
  });

  const busy = createMut.isPending || updateMut.isPending;

  const uploadCover = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      const json: unknown = await res.json();
      if (
        typeof json === "object" &&
        json !== null &&
        "ok" in json &&
        (json as { ok: boolean }).ok === true &&
        "data" in json &&
        typeof (json as { data: { url?: string } }).data?.url === "string"
      ) {
        form.setValue("coverImageUrl", (json as { data: { url: string } }).data.url);
        toast.success("Image uploaded");
        return;
      }
      const msg =
        typeof json === "object" &&
        json !== null &&
        "ok" in json &&
        (json as { ok: boolean }).ok === false &&
        "error" in json
          ? (json as { error?: { message?: string } }).error?.message ?? "Upload failed"
          : "Upload failed";
      toast.error(msg);
      throw new Error(msg);
    } catch (e) {
      const err = e instanceof Error ? e : new Error("Upload failed");
      if (err.message === "Failed to fetch" || err.name === "TypeError") {
        toast.error("Network error. Try again.");
      }
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const columns = useMemo<ColumnDef<AdminCampaignRow, unknown>[]>(
    () => [
      {
        accessorKey: "coverImageUrl",
        header: "",
        cell: ({ row }) => {
          const url = row.original.coverImageUrl;
          if (!url) {
            return <span className="text-xs text-muted-foreground">—</span>;
          }
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt=""
              className="size-10 rounded-md border object-cover"
              width={40}
              height={40}
            />
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "title",
        header: "Listing",
      },
      {
        accessorKey: "slug",
        header: "Slug",
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground">{row.original.slug}</span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium">
            {row.original.status}
          </span>
        ),
      },
      {
        id: "goal",
        header: "Goal",
        cell: ({ row }) => formatMoney(row.original.goalAmount, row.original.currency),
      },
      {
        id: "raised",
        header: "Raised",
        cell: ({ row }) => formatMoney(row.original.raisedAmount, row.original.currency),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8" aria-label="Actions">
                <MoreHorizontalIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openEdit(row.original)}>
                <PencilIcon className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => void deleteRow(row.original.id)}
              >
                <TrashIcon className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        enableSorting: false,
      },
    ],
    [deleteRow],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Only administrators can create or edit investable listings.
        </p>
        <Button type="button" size="sm" onClick={openCreate}>
          <PlusIcon className="size-4" />
          New listing
        </Button>
      </div>

      {isPending ? (
        <div className="flex items-center gap-2 py-12 text-sm text-muted-foreground">
          <Loader2Icon className="size-4 animate-spin" />
          Loading listings…
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
          Could not load listings.{" "}
          <Button variant="link" className="h-auto p-0" onClick={() => void refetch()}>
            Retry
          </Button>
        </div>
      ) : data && !isApiSuccess(data) ? (
        <div className="rounded-lg border p-4 text-sm text-muted-foreground">
          {data.error.message}
        </div>
      ) : (
        <AdminDataTable columns={columns} data={rows} />
      )}

      <Sheet
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) setEditingId(null);
        }}
      >
        <SheetContent side="right" className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{editingId ? "Edit listing" : "New listing"}</SheetTitle>
            <SheetDescription>
              {editingId
                ? "Update fields and save. Amounts are in major units (e.g. dollars); stored as cents."
                : "Create a listing investors can browse. Cover image uploads go to Cloudinary."}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={onSubmit} className="flex flex-1 flex-col gap-4 px-4 pb-4">
            <div className="space-y-2">
              <Label htmlFor="camp-title">Title</Label>
              <Input id="camp-title" {...form.register("title")} />
              {form.formState.errors.title && (
                <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="camp-slug">Slug (optional)</Label>
              <Input id="camp-slug" {...form.register("slug")} placeholder="auto-generated if empty" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="camp-summary">Summary</Label>
              <Input id="camp-summary" {...form.register("summary")} />
              {form.formState.errors.summary && (
                <p className="text-xs text-destructive">{form.formState.errors.summary.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="camp-desc">Description</Label>
              <textarea id="camp-desc" className={textareaClassName} {...form.register("description")} />
              {form.formState.errors.description && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="camp-goal">Funding goal</Label>
                <Input
                  id="camp-goal"
                  type="number"
                  step="0.01"
                  min={0.01}
                  {...form.register("goalDollars", { valueAsNumber: true })}
                />
                {form.formState.errors.goalDollars && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.goalDollars.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="camp-currency">Currency</Label>
                <Input id="camp-currency" maxLength={12} {...form.register("currency")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.watch("status")}
                onValueChange={(v) =>
                  form.setValue("status", v as FormValues["status"], { shouldValidate: true })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {campaignStatusValues.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cover image</Label>
              <FileDropZone
                accept="image/*"
                remoteUrl={form.watch("coverImageUrl")?.trim() || null}
                isUploading={uploading}
                disabled={busy}
                onFileSelect={uploadCover}
                onClear={() => form.setValue("coverImageUrl", "")}
                hint="Drag an image or click. Files upload to Cloudinary; max size follows NEXT_PUBLIC_MAX_UPLOAD_MB."
              />
              <input type="hidden" {...form.register("coverImageUrl")} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="camp-start">Starts (optional)</Label>
                <Input id="camp-start" type="datetime-local" {...form.register("startsAt")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="camp-end">Ends (optional)</Label>
                <Input id="camp-end" type="datetime-local" {...form.register("endsAt")} />
              </div>
            </div>

            <SheetFooter className="mt-4 flex-row justify-end gap-2 p-0">
              <Button type="button" variant="outline" onClick={() => setSheetOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={busy}>
                {busy ? "Saving…" : editingId ? "Save changes" : "Create listing"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
