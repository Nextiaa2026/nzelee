"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UsersIcon,
  ImageOffIcon,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { AdminDataTable } from "@/components/admin-data-table";
import { FileDropZone } from "@/components/file-drop-zone";
import { MockQueryPlaceholder } from "@/components/mock-query-placeholder";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchInput } from "@/components/ui/search-input";
import {
  FullTopSheet,
  FullTopSheetCancelButton,
} from "@/components/ui/full-top-sheet";
import { openPublicCampaign } from "@/lib/admin/open-links";
import { isApiSuccess } from "@/lib/http/api-result";
import {
  adminCreateCampaign,
  adminDeleteCampaign,
  adminListCampaigns,
  adminUpdateCampaign,
  type AdminCampaignRow,
} from "@/lib/services/admin";
import { adminListPledges } from "@/lib/services/admin-rest";
import type { AdminPledgeListRow } from "@/types/api/admin";
import { campaignStatusValues } from "@/lib/validations/admin-campaign";
import { cn } from "@/lib/utils";

const textareaClassName = cn(
  "min-h-28 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/45 focus-visible:ring-offset-0 disabled:opacity-50 md:text-sm dark:bg-input/30",
);

const formSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(180),
  summary: z.string().trim().min(1).max(320),
  description: z.string().trim().min(1),
  activitySector: z.string().trim().max(100).optional(),
  projectOwner: z.string().trim().max(120).optional(),
  locationLabel: z.string().trim().max(160).optional(),
  goalDollars: z.number().positive("Goal must be greater than zero"),
  minimumInvestment: z.number().positive().optional(),
  targetReturnRate: z.number().int().min(0).max(100).optional(),
  durationMonths: z.number().int().positive().max(240).optional(),
  currency: z.string().trim().min(1).max(12),
  tagsInput: z.string().optional(),
  impactPointsInput: z.string().optional(),
  galleryImagesInput: z.string().optional(),
  documentsInput: z.string().optional(),
  isVerified: z.boolean(),
  isFeatured: z.boolean(),
  status: z.enum(campaignStatusValues),
  coverImageUrl: z.string().optional(),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function toDatetimeValue(value: Date | string | null | undefined) {
  if (value === null || value === undefined) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString();
}

const emptyDefaults: FormValues = {
  title: "",
  summary: "",
  description: "",
  activitySector: "",
  projectOwner: "",
  locationLabel: "",
  goalDollars: 1000,
  minimumInvestment: 100,
  targetReturnRate: 12,
  durationMonths: 36,
  currency: "USD",
  tagsInput: "",
  impactPointsInput: "",
  galleryImagesInput: "",
  documentsInput: "",
  isVerified: false,
  isFeatured: false,
  status: "DRAFT",
  coverImageUrl: "",
  startsAt: "",
  endsAt: "",
};

function rowToForm(row: AdminCampaignRow): FormValues {
  return {
    title: row.title,
    summary: row.summary,
    description: row.description,
    activitySector: row.activitySector ?? "",
    projectOwner: row.projectOwner ?? "",
    locationLabel: row.locationLabel ?? "",
    goalDollars: row.goalAmount / 100,
    minimumInvestment:
      row.minimumInvestmentAmount != null
        ? row.minimumInvestmentAmount / 100
        : undefined,
    targetReturnRate: row.targetReturnRate ?? undefined,
    durationMonths: row.durationMonths ?? undefined,
    currency: row.currency,
    tagsInput: (row.tags ?? []).join(", "),
    impactPointsInput: (row.impactPoints ?? []).join("\n"),
    galleryImagesInput: (row.galleryImages ?? [])
      .map((img) => `${img.url}${img.alt ? `|${img.alt}` : ""}`)
      .join("\n"),
    documentsInput: (row.documents ?? [])
      .map((doc) => `${doc.name}|${doc.url}`)
      .join("\n"),
    isVerified: row.isVerified ?? false,
    isFeatured: row.isFeatured,
    status: row.status,
    coverImageUrl: row.coverImageUrl ?? "",
    startsAt: toDatetimeValue(row.startsAt),
    endsAt: toDatetimeValue(row.endsAt),
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

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "2-digit",
});

function formatDate(value: Date | string | null | undefined) {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return dateFormatter.format(date);
}

async function copyText(value: string, label: string) {
  await navigator.clipboard.writeText(value);
  toast.success(`${label} copié`);
}

export function AdminCampaignsPanel() {
  const qc = useQueryClient();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"form" | "investors">("form");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
    null,
  );
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | (typeof campaignStatusValues)[number]
  >("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [investorsPage, setInvestorsPage] = useState(1);
  const investorsPageSize = 20;
  const [wizardStep, setWizardStep] = useState(0);

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["admin", "campaigns", { page, pageSize, search }],
    queryFn: () =>
      adminListCampaigns({ page, pageSize, search: search || undefined }),
  });

  const rows = useMemo<AdminCampaignRow[]>(
    () => (data && isApiSuccess(data) ? data.data.items : []),
    [data],
  );
  const total = data && isApiSuccess(data) ? data.data.total : 0;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const { data: pledgesRes } = useQuery({
    queryKey: [
      "admin",
      "pledges",
      { page: investorsPage, pageSize: investorsPageSize },
    ],
    queryFn: () =>
      adminListPledges({ page: investorsPage, pageSize: investorsPageSize }),
  });
  const pledgeRows = useMemo<AdminPledgeListRow[]>(
    () => (pledgesRes && isApiSuccess(pledgesRes) ? pledgesRes.data.items : []),
    [pledgesRes],
  );
  const selectedCampaign = useMemo(
    () => rows.find((row) => row.id === selectedCampaignId) ?? null,
    [rows, selectedCampaignId],
  );
  const selectedCampaignInvestors = useMemo(
    () => pledgeRows.filter((row) => row.campaignId === selectedCampaignId),
    [pledgeRows, selectedCampaignId],
  );
  const filteredRows = useMemo(
    () =>
      rows.filter(
        (row) => statusFilter === "ALL" || row.status === statusFilter,
      ),
    [rows, statusFilter],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: emptyDefaults,
  });
  const selectedStatus = useWatch({ control: form.control, name: "status" });
  const selectedIsVerified =
    useWatch({ control: form.control, name: "isVerified" }) ?? false;
  const selectedIsFeatured =
    useWatch({ control: form.control, name: "isFeatured" }) ?? false;
  const selectedCoverImageUrl =
    useWatch({ control: form.control, name: "coverImageUrl" }) ?? "";

  const openCreate = () => {
    setSheetMode("form");
    setEditingId(null);
    form.reset(emptyDefaults);
    setWizardStep(0);
    setSheetOpen(true);
  };

  const openEdit = useCallback(
    (row: AdminCampaignRow) => {
      setSheetMode("form");
      setEditingId(row.id);
      form.reset(rowToForm(row));
      setWizardStep(0);
      setSheetOpen(true);
    },
    [form],
  );

  const openInvestors = useCallback((row: AdminCampaignRow) => {
    setSheetMode("investors");
    setSelectedCampaignId(row.id);
    setSheetOpen(true);
  }, []);

  const createMut = useMutation({
    mutationFn: adminCreateCampaign,
    onSuccess: (res) => {
      if (isApiSuccess(res)) {
        toast.success("Annonce créée");
        void qc.invalidateQueries({ queryKey: ["admin", "campaigns"] });
        setSheetOpen(false);
      } else {
        toast.error(res.error.message);
      }
    },
    onError: () => toast.error("Request failed"),
  });

  const updateMut = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: Parameters<typeof adminUpdateCampaign>[1];
    }) => adminUpdateCampaign(id, body),
    onSuccess: (res) => {
      if (isApiSuccess(res)) {
        toast.success("Annonce mise à jour");
        void qc.invalidateQueries({ queryKey: ["admin", "campaigns"] });
        setSheetOpen(false);
      } else {
        toast.error(res.error.message);
      }
    },
    onError: () => toast.error("La requête a échoué"),
  });

  const deleteRow = useCallback(
    async (id: string) => {
      if (!globalThis.confirm("Supprimer cette annonce ? Cette action est irréversible."))
        return;
      const res = await adminDeleteCampaign(id);
      if (isApiSuccess(res)) {
        toast.success("Annonce supprimée");
        void qc.invalidateQueries({ queryKey: ["admin", "campaigns"] });
      } else {
        toast.error(res.error.message);
      }
    },
    [qc],
  );

  const onSubmit = form.handleSubmit((values) => {
    const goalAmount = Math.round(values.goalDollars * 100);
    const minimumInvestmentAmount = values.minimumInvestment
      ? Math.round(values.minimumInvestment * 100)
      : undefined;
    const trimmedCover = values.coverImageUrl?.trim() ?? "";
    const tags = (values.tagsInput ?? "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    const impactPoints = (values.impactPointsInput ?? "")
      .split("\n")
      .map((point) => point.trim())
      .filter(Boolean);
    const galleryImages = (values.galleryImagesInput ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [url, alt] = line.split("|").map((part) => part.trim());
        return { url, alt: alt || undefined };
      });
    const documents = (values.documentsInput ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, idx) => {
        const [name, url] = line.split("|").map((part) => part.trim());
        if (url) return { name, url };
        return { name: `Document ${idx + 1}`, url: name };
      });

    if (editingId) {
      updateMut.mutate({
        id: editingId,
        body: {
          slug: undefined,
          title: values.title,
          summary: values.summary,
          description: values.description,
          activitySector: values.activitySector?.trim() || undefined,
          projectOwner: values.projectOwner?.trim() || undefined,
          locationLabel: values.locationLabel?.trim() || undefined,
          isVerified: values.isVerified,
          goalAmount,
          minimumInvestmentAmount,
          targetReturnRate: values.targetReturnRate,
          durationMonths: values.durationMonths,
          currency: values.currency.trim(),
          isFeatured: values.isFeatured,
          status: values.status,
          tags,
          impactPoints,
          galleryImages,
          documents,
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
        slug: undefined,
        title: values.title,
        summary: values.summary,
        description: values.description,
        activitySector: values.activitySector?.trim() || undefined,
        projectOwner: values.projectOwner?.trim() || undefined,
        locationLabel: values.locationLabel?.trim() || undefined,
        isVerified: values.isVerified,
        goalAmount,
        minimumInvestmentAmount,
        targetReturnRate: values.targetReturnRate,
        durationMonths: values.durationMonths,
        currency: values.currency.trim(),
        isFeatured: values.isFeatured,
        status: values.status,
        tags,
        impactPoints,
        galleryImages,
        documents,
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

  const deleteCoverByUrl = async (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return;
    try {
      await fetch("/api/v1/admin/upload-image", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
        credentials: "include",
      });
    } catch {
      // Do not block editing if delete call fails.
    }
  };

  const uploadCover = async (file: File) => {
    setUploading(true);
    try {
      const oldCover = form.getValues("coverImageUrl")?.trim();
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/v1/admin/upload-image", {
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
        const newUrl = (json as { data: { url: string } }).data.url;
        form.setValue("coverImageUrl", newUrl);
        if (oldCover && oldCover !== newUrl) {
          await deleteCoverByUrl(oldCover);
        }
        toast.success("Image téléchargée");
        return;
      }
      const msg =
        typeof json === "object" &&
        json !== null &&
        "ok" in json &&
        (json as { ok: boolean }).ok === false &&
        "error" in json
          ? ((json as { error?: { message?: string } }).error?.message ??
            "Upload failed")
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
            return (
              <div className="flex size-10 items-center justify-center rounded-md border bg-black/5">
                <ImageOffIcon className="size-4 text-black/45" />
              </div>
            );
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
        header: "Titre",
      },
      {
        accessorKey: "slug",
        header: "Slug",
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground">
            {row.original.slug}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Statut",
        cell: ({ row }) => {
          const statusColors: Record<string, string> = {
            DRAFT: "bg-slate-500/10 text-slate-600 border-slate-500/20",
            ACTIVE: "bg-green-500/10 text-green-600 border-green-500/20",
            SUCCESSFUL: "bg-mint/20 text-mint-foreground border-mint/30",
            FAILED: "bg-red-500/10 text-red-600 border-red-500/20",
            CANCELLED: "bg-red-500/10 text-red-600 border-red-500/20",
          };
          const statusLabels: Record<string, string> = {
            DRAFT: "Brouillon",
            ACTIVE: "Actif",
            SUCCESSFUL: "Succès",
            FAILED: "Échec",
            CANCELLED: "Annulé",
          };
          const colorClass =
            statusColors[row.original.status] ||
            "bg-secondary text-secondary-foreground";
          return (
            <span
              className={cn(
                "rounded-md border px-2 py-0.5 text-xs font-medium",
                colorClass,
              )}
            >
              {statusLabels[row.original.status] || row.original.status}
            </span>
          );
        },
      },
      {
        accessorKey: "isFeatured",
        header: "À la une",
        cell: ({ row }) =>
          row.original.isFeatured ? (
            <span className="rounded-md bg-mint/20 px-2 py-0.5 text-xs font-medium text-mint-foreground">
              Oui
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">Non</span>
          ),
      },
      {
        id: "goal",
        header: "Objectif",
        cell: ({ row }) =>
          formatMoney(row.original.goalAmount, row.original.currency),
      },
      {
        id: "raised",
        header: "Collecté",
        cell: ({ row }) =>
          formatMoney(row.original.raisedAmount, row.original.currency),
      },
      {
        accessorKey: "currency",
        header: "Devise",
      },
      {
        id: "window",
        header: "Période",
        cell: ({ row }) => (
          <span className="text-xs text-black/65">
            {formatDate(row.original.startsAt)} -{" "}
            {formatDate(row.original.endsAt)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                aria-label="Actions"
              >
                <MoreHorizontalIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => openPublicCampaign(row.original.slug)}
              >
                Ouvrir la page publique
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => void copyText(row.original.slug, "Slug")}
              >
                Copier le slug
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => void copyText(row.original.id, "ID de campagne")}
              >
                Copier l&apos;ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => openInvestors(row.original)}>
                <UsersIcon className="mr-2 size-4" />
                Investisseurs
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openEdit(row.original)}>
                <PencilIcon className="mr-2 size-4" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => void deleteRow(row.original.id)}
              >
                <TrashIcon className="mr-2 size-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        enableSorting: false,
      },
    ],
    [deleteRow, openEdit, openInvestors],
  );
  const investorColumns = useMemo<ColumnDef<AdminPledgeListRow, unknown>[]>(
    () => [
      {
        accessorKey: "backerName",
        header: "Investisseur",
        cell: ({ row }) => row.original.backerName ?? "—",
      },
      {
        accessorKey: "backerEmail",
        header: "Email",
      },
      {
        accessorKey: "amount",
        header: "Montant",
        cell: ({ row }) => formatMoney(row.original.amount, "USD"),
      },
      {
        accessorKey: "status",
        header: "Status",
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => formatDate(row.original.createdAt),
      },
    ],
    [],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Rechercher titre ou slug"
            className="h-9 w-72 rounded-md bg-white"
          />
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              {
                setStatusFilter(
                  value as "ALL" | (typeof campaignStatusValues)[number],
                );
                setPage(1);
              }
            }
          >
            <SelectTrigger className="h-9 w-36 rounded-md bg-white">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="ALL">Tous les statuts</SelectItem>
              {campaignStatusValues.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          type="button"
          size="sm"
          className="rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={openCreate}
        >
          <PlusIcon className="size-4" />
          Nouveau projet
        </Button>
      </div>
      <MockQueryPlaceholder
        isPending={isPending}
        isError={isError}
        onRetry={() => void refetch()}
      />
      {!isPending && !isError && data && !isApiSuccess(data) ? (
        <div className="rounded-lg border p-4 text-sm text-muted-foreground">
          {data.error.message}
        </div>
      ) : !isPending && !isError ? (
        <>
          <AdminDataTable columns={columns} data={filteredRows} />
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
        </>
      ) : null}

      <FullTopSheet
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) setEditingId(null);
        }}
        title={
          sheetMode === "investors"
            ? `Investisseurs — ${selectedCampaign?.title ?? "Annonce"}`
            : editingId
              ? "Modifier l'annonce"
              : "Nouvelle annonce"
        }
        description={
          sheetMode === "investors"
            ? "Tous les investissements pour cette annonce, incluant les noms des investisseurs et les montants."
            : editingId
              ? "Mettez à jour les champs et enregistrez. Les montants sont en unités majeures (ex: dollars) ; stockés en centimes."
              : "Créez une annonce que les investisseurs peuvent consulter. Les téléchargements d'images de couverture vont sur Cloudinary."
        }
        bodyClassName="gap-4"
        footer={
          sheetMode === "investors" ? (
            <div className="flex w-full flex-wrap items-center justify-between gap-2">
              <FullTopSheetCancelButton onClick={() => setSheetOpen(false)}>
                Fermer
              </FullTopSheetCancelButton>
            </div>
          ) : (
            <div className="flex w-full flex-wrap items-center justify-between gap-2">
              <FullTopSheetCancelButton onClick={() => setSheetOpen(false)}>
                Annuler
              </FullTopSheetCancelButton>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={wizardStep === 0 || busy}
                  onClick={() => setWizardStep((step) => Math.max(0, step - 1))}
                >
                  Retour
                </Button>
                {wizardStep < 2 ? (
                  <Button
                    type="button"
                    disabled={busy}
                    onClick={async () => {
                      const stepFields: (keyof FormValues)[][] = [
                        [
                          "title",
                          "summary",
                          "description",
                          "activitySector",
                          "projectOwner",
                          "locationLabel",
                        ],
                        [
                          "goalDollars",
                          "minimumInvestment",
                          "targetReturnRate",
                          "durationMonths",
                          "currency",
                          "status",
                        ],
                      ];
                      const fields = stepFields[wizardStep];
                      if (!fields) return;
                      const ok = await form.trigger(fields);
                      if (!ok) return;
                      setWizardStep((step) => Math.min(2, step + 1));
                    }}
                  >
                    Suivant
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    form="campaign-sheet-form"
                    disabled={busy}
                  >
                    {busy
                      ? "Enregistrement…"
                      : editingId
                        ? "Enregistrer les modifications"
                        : "Créer le projet"}
                  </Button>
                )}
              </div>
            </div>
          )
        }
      >
        {sheetMode === "investors" ? (
          <div className="space-y-4">
            <p className="text-sm text-black/65">
              Total investments: {selectedCampaignInvestors.length}
            </p>
            <AdminDataTable
              columns={investorColumns}
              data={selectedCampaignInvestors}
            />
            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-8"
                aria-label="Previous investors page"
                disabled={investorsPage <= 1}
                onClick={() => setInvestorsPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeftIcon className="size-4" />
              </Button>
              <p className="text-xs text-black/60">Page {investorsPage}</p>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-8"
                aria-label="Next investors page"
                disabled={pledgeRows.length < investorsPageSize}
                onClick={() => setInvestorsPage((p) => p + 1)}
              >
                <ChevronRightIcon className="size-4" />
              </Button>
            </div>
          </div>
        ) : (
          <form
            id="campaign-sheet-form"
            onSubmit={onSubmit}
            className="flex flex-1 flex-col gap-4 overflow-y-auto pb-4"
          >
            <div className="flex items-center gap-2 rounded-lg border bg-black/3 p-2 text-xs">
              {["Bases", "Finance", "Médias & publication"].map((label, idx) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setWizardStep(idx)}
                  className={cn(
                    "rounded-md px-3 py-1.5 transition",
                    wizardStep === idx
                      ? "bg-primary text-primary-foreground"
                      : "bg-white text-black/70",
                  )}
                >
                  {idx + 1}. {label}
                </button>
              ))}
            </div>

            {wizardStep === 0 ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="camp-title">Titre</Label>
                  <Input id="camp-title" {...form.register("title")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="camp-summary">Résumé</Label>
                  <Input id="camp-summary" {...form.register("summary")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="camp-desc">Description</Label>
                  <textarea
                    id="camp-desc"
                    className={textareaClassName}
                    {...form.register("description")}
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="camp-sector">Secteur</Label>
                    <Input id="camp-sector" {...form.register("activitySector")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="camp-owner">Porteur de projet</Label>
                    <Input id="camp-owner" {...form.register("projectOwner")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="camp-location">Localisation</Label>
                    <Input id="camp-location" {...form.register("locationLabel")} />
                  </div>
                </div>
              </>
            ) : null}

            {wizardStep === 1 ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="camp-goal">Objectif de financement</Label>
                    <Input
                      id="camp-goal"
                      type="number"
                      step="0.01"
                      min={0.01}
                      {...form.register("goalDollars", { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="camp-minimum">Investissement minimum</Label>
                    <Input
                      id="camp-minimum"
                      type="number"
                      step="0.01"
                      min={0.01}
                      {...form.register("minimumInvestment", {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="camp-return">Rendement cible (%)</Label>
                    <Input
                      id="camp-return"
                      type="number"
                      {...form.register("targetReturnRate", { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="camp-duration">Durée (mois)</Label>
                    <Input
                      id="camp-duration"
                      type="number"
                      {...form.register("durationMonths", { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="camp-currency">Devise</Label>
                    <Input id="camp-currency" {...form.register("currency")} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={selectedStatus}
                    onValueChange={(v) =>
                      form.setValue("status", v as FormValues["status"], {
                        shouldValidate: true,
                      })
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
              </>
            ) : null}

            {wizardStep === 2 ? (
              <>
                <div className="flex items-start gap-3 rounded-lg border p-3">
                  <Checkbox
                    id="camp-verified"
                    checked={selectedIsVerified}
                    onCheckedChange={(v) => form.setValue("isVerified", v === true)}
                  />
                  <Label htmlFor="camp-verified">Campagne vérifiée</Label>
                </div>
                <div className="flex items-start gap-3 rounded-lg border p-3">
                  <Checkbox
                    id="camp-featured"
                    checked={selectedIsFeatured}
                    onCheckedChange={(v) => form.setValue("isFeatured", v === true)}
                  />
                  <Label htmlFor="camp-featured">Campagne à la une</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="camp-tags">Étiquettes (séparées par des virgules)</Label>
                  <Input id="camp-tags" {...form.register("tagsInput")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="camp-impact">Points d&apos;impact (un par ligne)</Label>
                  <textarea
                    id="camp-impact"
                    className={textareaClassName}
                    {...form.register("impactPointsInput")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="camp-gallery">URLs de la galerie (une par ligne)</Label>
                  <textarea
                    id="camp-gallery"
                    className={textareaClassName}
                    {...form.register("galleryImagesInput")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="camp-docs">URLs des documents (une par ligne)</Label>
                  <textarea
                    id="camp-docs"
                    className={textareaClassName}
                    {...form.register("documentsInput")}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cover image</Label>
                  <FileDropZone
                    accept="image/*"
                    remoteUrl={selectedCoverImageUrl.trim() || null}
                    isUploading={uploading}
                    disabled={busy}
                    onFileSelect={uploadCover}
                    onClear={() => {
                      const current = form.getValues("coverImageUrl")?.trim();
                      form.setValue("coverImageUrl", "");
                      if (current) void deleteCoverByUrl(current);
                    }}
                    hint="Drag an image or click. Files upload to Cloudinary; max size follows NEXT_PUBLIC_MAX_UPLOAD_MB."
                  />
                  <input type="hidden" {...form.register("coverImageUrl")} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="camp-start">Débute (optionnel)</Label>
                    <DateTimePicker
                      value={form.watch("startsAt")}
                      onChange={(date) =>
                        form.setValue("startsAt", date?.toISOString() ?? "", {
                          shouldValidate: true,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="camp-end">Finit (optionnel)</Label>
                    <DateTimePicker
                      value={form.watch("endsAt")}
                      onChange={(date) =>
                        form.setValue("endsAt", date?.toISOString() ?? "", {
                          shouldValidate: true,
                        })
                      }
                    />
                  </div>
                </div>
              </>
            ) : null}
          </form>
        )}
      </FullTopSheet>
    </div>
  );
}
