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
  FullTopSheet,
  FullTopSheetCancelButton,
} from "@/components/ui/full-top-sheet";
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
        No {label}
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
      toast.success("KYC decision saved");
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
        header: "User",
      },
      {
        accessorKey: "documentType",
        header: "Document",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{row.original.status}</Badge>
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
              Review
            </Button>
          </div>
        ),
      },
      {
        accessorKey: "userCountry",
        header: "Country",
        cell: ({ row }) => row.original.userCountry ?? "—",
      },
      {
        accessorKey: "userOrganization",
        header: "Organization",
        cell: ({ row }) => row.original.userOrganization ?? "—",
      },
      {
        accessorKey: "submittedAt",
        header: "Submitted",
        cell: ({ row }) => formatDateLong(row.original.submittedAt),
      },
      {
        accessorKey: "reviewedAt",
        header: "Reviewed",
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
                Preview and decide
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
                Open first document
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => void copyText(row.original.id, "Submission id")}
              >
                Copy submission id
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => void copyText(row.original.userId, "User id")}
              >
                Copy user id
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href={`mailto:${row.original.userEmail}`}>Email user</a>
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
      <FullTopSheet
        open={!!reviewing}
        onOpenChange={(open) => {
          if (!open) {
            setReviewing(null);
            setRejectReason("");
          }
        }}
        title="KYC review"
        description={
          reviewing
            ? `${reviewing.userEmail} · ${reviewing.documentType} · ${reviewing.status}`
            : undefined
        }
        bodyClassName="gap-4"
        bodyInnerClassName="max-w-3xl"
        footer={
          <div className="flex w-full flex-wrap items-center justify-between gap-2">
            <FullTopSheetCancelButton
              onClick={() => {
                setReviewing(null);
                setRejectReason("");
              }}
            >
              Close
            </FullTopSheetCancelButton>
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
                Mark under review
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
                Verify (approve)
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
                      "Add a short rejection reason (at least 3 characters).",
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
                Reject
              </Button>
            </div>
          </div>
        }
      >
        {reviewing ? (
          <div className="flex flex-col gap-6">
            <div className="grid gap-3 rounded-lg border bg-muted/30 p-4">
              <h3 className="font-semibold text-sm">User Information</h3>
              <div className="grid gap-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Name:</span>{" "}
                  <span className="font-medium">
                    {reviewing.userName ?? "—"}
                  </span>
                </p>
                <p>
                  <span className="text-muted-foreground">Email:</span>{" "}
                  <span className="font-medium">{reviewing.userEmail}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Country:</span>{" "}
                  <span className="font-medium">
                    {reviewing.userCountry ?? "—"}
                  </span>
                </p>
                <p>
                  <span className="text-muted-foreground">Date of Birth:</span>{" "}
                  <span className="font-medium">
                    {formatDateLong(reviewing.userDateOfBirth) || "—"}
                  </span>
                </p>
                <p>
                  <span className="text-muted-foreground">Organization:</span>{" "}
                  <span className="font-medium">
                    {reviewing.userOrganization ?? "—"}
                  </span>
                </p>
                <p>
                  <span className="text-muted-foreground">
                    Onboarding Completed:
                  </span>{" "}
                  <span className="font-medium">
                    {formatDateLong(reviewing.userOnboardingCompletedAt) ||
                      "Not completed"}
                  </span>
                </p>
              </div>
            </div>
            <div className="grid gap-2 text-sm">
              <p>
                <span className="text-muted-foreground">Submitted:</span>{" "}
                {formatDateLong(reviewing.submittedAt)}
              </p>
              {reviewing.rejectionReason ? (
                <p className="rounded-md border border-destructive/30 bg-destructive/5 p-2 text-xs">
                  <span className="font-semibold">Last rejection reason:</span>{" "}
                  {reviewing.rejectionReason}
                </p>
              ) : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <KycImagePreview
                label="Document front"
                url={reviewing.documentFrontUrl}
              />
              <KycImagePreview
                label="Document back"
                url={reviewing.documentBackUrl}
              />
              <KycImagePreview label="Selfie" url={reviewing.selfieUrl} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kyc-reject-reason">
                Rejection reason (required to reject)
              </Label>
              <Input
                id="kyc-reject-reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Shown to the applicant in their notification"
                className="max-w-xl"
              />
            </div>
          </div>
        ) : null}
      </FullTopSheet>
    </>
  );
}
