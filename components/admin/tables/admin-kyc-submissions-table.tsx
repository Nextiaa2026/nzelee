"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { MoreHorizontalIcon } from "lucide-react";
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isApiSuccess } from "@/lib/http/api-result";
import { adminQueryKeys } from "@/lib/query-keys/admin";
import { adminPatchKycSubmission } from "@/lib/services/admin-rest";
import { cn } from "@/lib/utils";
import { formatDateLong } from "@/lib/format/date";
import type { AdminKycSubmissionRow } from "@/types/api/admin";

const imgBox =
  "relative aspect-[4/3] max-h-56 overflow-hidden rounded-lg border bg-muted";

function KycImagePreview({
  label,
  url,
}: {
  label: string;
  url: string | null;
}) {
  if (!url) {
    return (
      <div
        className={cn(
          imgBox,
          "flex items-center justify-center p-4 text-center text-xs text-muted-foreground",
        )}
      >
        Pas de {label}
      </div>
    );
  }
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className={imgBox}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={label} className="size-full object-contain" />
      </div>
    </div>
  );
}

export function AdminKycSubmissionsTable({
  data,
}: {
  data: AdminKycSubmissionRow[];
}) {
  const qc = useQueryClient();
  const [reviewing, setReviewing] = useState<AdminKycSubmissionRow | null>(
    null,
  );
  const [rejectReason, setRejectReason] = useState("");

  const copyText = async (value: string, label: string) => {
    await navigator.clipboard.writeText(value);
    toast.success(`${label} copied`);
  };

  const patchMut = useMutation({
    mutationFn: ({
      id,
      status,
      rejectionReason,
    }: {
      id: string;
      status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "EXPIRED";
      rejectionReason?: string | null;
    }) =>
      adminPatchKycSubmission(id, {
        status,
        rejectionReason:
          status === "REJECTED" ? (rejectionReason ?? null) : null,
      }),
    onSuccess: async (res) => {
      if (!isApiSuccess(res)) {
        toast.error(res.error.message);
        return;
      }
      toast.success("Décision KYC enregistrée");
      setReviewing(null);
      setRejectReason("");
      await qc.invalidateQueries({ queryKey: adminQueryKeys.kycSubmissions() });
    },
    onError: () => toast.error("Failed to update KYC"),
  });

  const busy = patchMut.isPending;

  const columns = useMemo<ColumnDef<AdminKycSubmissionRow, unknown>[]>(
    () => [
      {
        accessorKey: "userEmail",
        header: "Utilisateur",
      },
      {
        accessorKey: "documentType",
        header: "Document",
      },
      {
        accessorKey: "status",
        header: "Statut",
        cell: ({ row }) => {
          const statusMap: Record<string, string> = {
            PENDING: "En attente",
            UNDER_REVIEW: "En cours",
            APPROVED: "Vérifié",
            REJECTED: "Rejeté",
            EXPIRED: "Expiré",
          };
          return (
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{statusMap[row.original.status] || row.original.status}</Badge>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="h-8"
                onClick={() => {
                  setRejectReason("");
                  setReviewing(row.original);
                }}
              >
                Examiner
              </Button>
            </div>
          );
        },
      },
      {
        accessorKey: "userCountry",
        header: "Pays",
        cell: ({ row }) => row.original.userCountry ?? "—",
      },
      {
        accessorKey: "userOrganization",
        header: "Organisation",
        cell: ({ row }) => row.original.userOrganization ?? "—",
      },
      {
        accessorKey: "submittedAt",
        header: "Soumis",
        cell: ({ row }) => formatDateLong(row.original.submittedAt),
      },
      {
        accessorKey: "reviewedAt",
        header: "Examiné",
        cell: ({ row }) => formatDateLong(row.original.reviewedAt) || "—",
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
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={() => {
                  setRejectReason("");
                  setReviewing(row.original);
                }}
              >
                Prévisualiser et décider
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const url =
                    row.original.documentFrontUrl ??
                    row.original.documentBackUrl ??
                    row.original.selfieUrl;
                  if (!url) {
                    toast.error("No document URL on file");
                    return;
                  }
                  window.open(url, "_blank", "noopener,noreferrer");
                }}
              >
                Ouvrir le premier document
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => void copyText(row.original.id, "ID de soumission")}
              >
                Copier l&apos;ID de soumission
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => void copyText(row.original.userId, "ID utilisateur")}
              >
                Copier l&apos;ID utilisateur
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href={`mailto:${row.original.userEmail}`}>Envoyer un email</a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <AdminDataTable columns={columns} data={data} />
      <Sheet
        open={!!reviewing}
        onOpenChange={(open) => {
          if (!open) {
            setReviewing(null);
            setRejectReason("");
          }
        }}
      >
        <SheetContent
          side="right"
          className="flex w-full flex-col gap-0 overflow-y-auto bg-white p-0 sm:max-w-xl"
        >
          <SheetHeader className="border-b px-6 py-4 text-left">
            <SheetTitle>Examen KYC</SheetTitle>
            <SheetDescription>
              {reviewing
                ? `${reviewing.userEmail} · ${reviewing.documentType} · ${reviewing.status}`
                : undefined}
            </SheetDescription>
          </SheetHeader>
          {reviewing ? (
            <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-4">
              <div className="grid gap-3 rounded-lg border bg-muted/30 p-4">
                <h3 className="text-sm font-semibold">
                  Informations de l&apos;utilisateur
                </h3>
                <div className="grid gap-2 text-sm">
                  <p>
                    <span className="text-muted-foreground">Nom:</span>{" "}
                    <span className="font-medium">
                      {reviewing.userName ?? "—"}
                    </span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Email:</span>{" "}
                    <span className="font-medium">{reviewing.userEmail}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Pays:</span>{" "}
                    <span className="font-medium">
                      {reviewing.userCountry ?? "—"}
                    </span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">
                      Date de naissance:
                    </span>{" "}
                    <span className="font-medium">
                      {formatDateLong(reviewing.userDateOfBirth) || "—"}
                    </span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Organisation:</span>{" "}
                    <span className="font-medium">
                      {reviewing.userOrganization ?? "—"}
                    </span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">
                      Onboarding terminé:
                    </span>{" "}
                    <span className="font-medium">
                      {formatDateLong(reviewing.userOnboardingCompletedAt) ||
                        "Non terminé"}
                    </span>
                  </p>
                </div>
              </div>
              <div className="grid gap-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Soumis:</span>{" "}
                  {formatDateLong(reviewing.submittedAt)}
                </p>
                {reviewing.rejectionReason ? (
                  <p className="rounded-md border border-destructive/30 bg-destructive/5 p-2 text-xs">
                    <span className="font-semibold">
                      Dernier motif de rejet:
                    </span>{" "}
                    {reviewing.rejectionReason}
                  </p>
                ) : null}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <KycImagePreview
                  label="Document recto"
                  url={reviewing.documentFrontUrl}
                />
                <KycImagePreview
                  label="Document verso"
                  url={reviewing.documentBackUrl}
                />
                <KycImagePreview label="Selfie" url={reviewing.selfieUrl} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kyc-reject-reason">
                  Motif du rejet (requis pour rejeter)
                </Label>
                <Input
                  id="kyc-reject-reason"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Affiché au demandeur dans sa notification"
                />
              </div>
            </div>
          ) : null}
          <SheetFooter className="flex-col gap-2 border-t px-6 py-4 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setReviewing(null);
                setRejectReason("");
              }}
            >
              Fermer
            </Button>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={busy || !reviewing}
                onClick={() => {
                  if (!reviewing) return;
                  patchMut.mutate({
                    id: reviewing.id,
                    status: "UNDER_REVIEW",
                    rejectionReason: null,
                  });
                }}
              >
                En examen
              </Button>
              <Button
                type="button"
                variant="default"
                className="bg-deep-green hover:bg-deep-green/90"
                disabled={busy || !reviewing}
                onClick={() => {
                  if (!reviewing) return;
                  patchMut.mutate({
                    id: reviewing.id,
                    status: "APPROVED",
                    rejectionReason: null,
                  });
                }}
              >
                Approuver
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={busy || !reviewing}
                onClick={() => {
                  if (!reviewing) return;
                  const trimmed = rejectReason.trim();
                  if (trimmed.length < 3) {
                    toast.error(
                      "Ajoutez un motif de rejet (au moins 3 caractères).",
                    );
                    return;
                  }
                  patchMut.mutate({
                    id: reviewing.id,
                    status: "REJECTED",
                    rejectionReason: trimmed,
                  });
                }}
              >
                Rejeter
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
