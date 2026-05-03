"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { FileDropZone } from "@/components/file-drop-zone";
import { ProjectWizardHorizontalStepper } from "@/components/dashboard/project-wizard-horizontal-stepper";
import { TagsInput } from "@/components/ui/tags-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FullTopSheet,
  FullTopSheetCancelButton,
} from "@/components/ui/full-top-sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isApiSuccess } from "@/lib/http/api-result";
import { adminCreateCampaign, adminUpdateCampaign } from "@/lib/services/admin";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import type { UserCampaignProject } from "@/lib/services/user-projects";
import { campaignStatusValues } from "@/lib/validations/admin-campaign";
import { cn } from "@/lib/utils";

type CrudMode = "create" | "update";

type ProjectsCrudModuleProps = {
  campaigns: UserCampaignProject[];
  initialMode?: CrudMode | null;
  initialCampaignId?: string | null;
};

const WIZARD_STEP_LABELS = [
  "Général",
  "Financier",
  "Visibilité",
  "Médias",
] as const;

const textareaClassName = cn(
  "min-h-28 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/45 focus-visible:ring-offset-0 disabled:opacity-50 md:text-sm dark:bg-input/30",
);

const formSchema = z.object({
  title: z.string().trim().min(1, "Le titre est requis").max(180),
  summary: z.string().trim().min(1, "Le résumé est requis").max(320),
  description: z.string().trim().min(1, "La description est requise"),
  sector: z.string().trim().min(1, "Le secteur est requis"),
  projectOwner: z.string().trim().min(1, "Le porteur de projet est requis").max(120),
  tags: z.array(z.string().trim().min(1)),
  documents: z.array(
    z.object({
      name: z.string().trim().min(1).max(120),
      url: z.string().trim().url(),
    }),
  ),
  goalDollars: z.number().positive("Goal must be greater than zero"),
  currency: z.string().trim().min(1).max(12),
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
  sector: "",
  projectOwner: "",
  tags: [],
  documents: [],
  goalDollars: 1000,
  currency: "USD",
  isFeatured: false,
  status: "DRAFT",
  coverImageUrl: "",
  startsAt: "",
  endsAt: "",
};

function campaignToForm(row: UserCampaignProject): FormValues {
  return {
    title: row.title,
    summary: row.summary,
    description: row.description,
    sector: row.activitySector ?? "",
    projectOwner: row.projectOwner ?? "",
    tags: row.tags ?? [],
    documents: row.documents ?? [],
    goalDollars: row.goalAmount / 100,
    currency: row.currency,
    isFeatured: row.isFeatured,
    status: row.status,
    coverImageUrl: row.coverImageUrl ?? "",
    startsAt: toDatetimeValue(row.startsAt),
    endsAt: toDatetimeValue(row.endsAt),
  };
}

const STEP_FIELDS: (keyof FormValues)[][] = [
  ["title", "sector", "projectOwner", "tags", "summary", "description"],
  ["goalDollars", "currency", "startsAt", "endsAt"],
  ["status", "isFeatured"],
  ["documents"],
];

export function ProjectsCrudModule({
  campaigns,
  initialMode = null,
  initialCampaignId = null,
}: ProjectsCrudModuleProps) {
  const router = useRouter();
  const hasInitialUpdate =
    initialMode === "update" &&
    typeof initialCampaignId === "string" &&
    campaigns.some((campaign) => campaign.id === initialCampaignId);

  const [mode, setMode] = useState<CrudMode>(
    hasInitialUpdate ? "update" : "create",
  );
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
    hasInitialUpdate ? initialCampaignId : null,
  );
  const [sheetOpen, setSheetOpen] = useState<boolean>(
    initialMode === "create" || hasInitialUpdate,
  );
  const [step, setStep] = useState(0);
  const [uploading, setUploading] = useState(false);

  const selectedCampaign = useMemo(
    () =>
      campaigns.find((campaign) => campaign.id === selectedCampaignId) ?? null,
    [campaigns, selectedCampaignId],
  );

  const editingId = mode === "update" ? selectedCampaignId : null;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: emptyDefaults,
  });

  useEffect(() => {
    if (!sheetOpen) {
      setStep(0);
      return;
    }
    if (mode === "create") {
      form.reset(emptyDefaults);
      return;
    }
    if (selectedCampaign) {
      form.reset(campaignToForm(selectedCampaign));
    }
  }, [sheetOpen, mode, selectedCampaign?.id, form, selectedCampaign]);

  const createMut = useMutation({
    mutationFn: adminCreateCampaign,
    onSuccess: (res) => {
      if (isApiSuccess(res)) {
        toast.success("Projet créé");
        router.refresh();
        setSheetOpen(false);
      } else {
        toast.error(res.error.message);
      }
    },
    onError: () => toast.error("La requête a échoué"),
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
        toast.success("Projet mis à jour");
        router.refresh();
        setSheetOpen(false);
      } else {
        toast.error(res.error.message);
      }
    },
    onError: () => toast.error("La requête a échoué"),
  });

  const busy = createMut.isPending || updateMut.isPending;

  const onSubmit = form.handleSubmit((values) => {
    const goalAmount = Math.round(values.goalDollars * 100);
    const trimmedCover = values.coverImageUrl?.trim() ?? "";

    if (editingId) {
      updateMut.mutate({
        id: editingId,
        body: {
          slug: undefined,
          title: values.title,
          summary: values.summary,
          description: values.description,
          activitySector: values.sector.trim(),
          projectOwner: values.projectOwner.trim(),
          tags: values.tags,
          documents: values.documents,
          galleryImages: [],
          impactPoints: [],
          goalAmount,
          currency: values.currency.trim(),
          isFeatured: values.isFeatured,
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
        slug: undefined,
        title: values.title,
        summary: values.summary,
        description: values.description,
        activitySector: values.sector.trim(),
        projectOwner: values.projectOwner.trim(),
        tags: values.tags,
        documents: values.documents,
        galleryImages: [],
        impactPoints: [],
        goalAmount,
        currency: values.currency.trim(),
        isFeatured: values.isFeatured,
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
      // non-blocking
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
            "Échec du téléchargement")
          : "Échec du téléchargement";
      toast.error(msg);
      throw new Error(msg);
    } catch (e) {
      const err = e instanceof Error ? e : new Error("Échec du téléchargement");
      if (err.message === "Failed to fetch" || err.name === "TypeError") {
        toast.error("Erreur réseau. Réessayez.");
      }
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const handleNext = useCallback(async () => {
    const fields = STEP_FIELDS[step];
    if (fields.length > 0) {
      const ok = await form.trigger(fields);
      if (!ok) return;
    }
    setStep((s) => Math.min(WIZARD_STEP_LABELS.length - 1, s + 1));
  }, [form, step]);

  const handleBack = useCallback(() => {
    setStep((s) => Math.max(0, s - 1));
  }, []);

  function openCreate() {
    setMode("create");
    setSelectedCampaignId(null);
    setStep(0);
    setSheetOpen(true);
  }

  function openUpdate(campaignId: string) {
    setMode("update");
    setSelectedCampaignId(campaignId);
    setStep(0);
    setSheetOpen(true);
  }

  const sheetDescription =
    mode === "create"
      ? `Étape ${step + 1} sur ${WIZARD_STEP_LABELS.length} — ${WIZARD_STEP_LABELS[step]}. Les montants sont en unités majeures (ex. dollars), stockés en cents.`
      : selectedCampaign
        ? `Étape ${step + 1} sur ${WIZARD_STEP_LABELS.length} — ${WIZARD_STEP_LABELS[step]}.`
        : undefined;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="hidden font-display text-2xl font-semibold tracking-tight text-foreground md:block md:text-3xl">
            Projets
          </h1>
          <p className="mt-0 max-w-2xl text-sm text-muted-foreground md:mt-2">
            Campagnes que vous avez créées (vue propriétaire). La création et la mise à jour utilisent le formulaire en quatre étapes ci-dessous.
          </p>
        </div>
        <Button type="button" onClick={openCreate}>
          Nouveau projet
        </Button>
      </div>

      {campaigns.length ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {campaigns.map((campaign) => (
            <li key={campaign.id}>
              <Card>
                <CardHeader className="pb-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {campaign.status}
                  </p>
                  <CardTitle className="text-base font-semibold leading-snug">
                    {campaign.title}
                  </CardTitle>
                  <CardDescription className="font-mono text-xs">
                    {campaign.slug}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-0">
                  <Button
                    variant="secondary"
                    size="sm"
                    type="button"
                    onClick={() => openUpdate(campaign.id)}
                  >
                    Ouvrir
                  </Button>
                </CardFooter>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Aucune campagne pour le moment</CardTitle>
            <CardDescription>
              Commencez un brouillon avec un titre, un résumé, un objectif de financement, une visibilité et
              une image de couverture avant de publier.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Les campagnes que vous créez (en tant que créateur) apparaissent ici et dans le menu Projets
              de la barre supérieure.
            </p>
          </CardContent>
          <CardFooter>
            <Button type="button" variant="secondary" onClick={openCreate}>
              Créer un brouillon
            </Button>
          </CardFooter>
        </Card>
      )}

      <FullTopSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title={mode === "create" ? "Nouveau projet" : "Modifier le projet"}
        description={sheetDescription}
        bodyClassName="gap-4"
        footer={
          mode === "update" && !selectedCampaign ? (
            <FullTopSheetCancelButton onClick={() => setSheetOpen(false)}>
              Fermer
            </FullTopSheetCancelButton>
          ) : (
            <div className="flex w-full flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-2">
                <FullTopSheetCancelButton onClick={() => setSheetOpen(false)}>
                  Annuler
                </FullTopSheetCancelButton>
                {step > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={busy}
                  >
                    Retour
                  </Button>
                )}
              </div>
              {step < WIZARD_STEP_LABELS.length - 1 ? (
                <Button
                  type="button"
                  onClick={() => void handleNext()}
                  disabled={busy}
                >
                  Continuer
                </Button>
              ) : (
                <Button
                  type="submit"
                  form="project-wizard-form"
                  disabled={busy}
                >
                  {busy
                    ? "Enregistrement…"
                    : mode === "create"
                      ? "Créer le projet"
                      : "Enregistrer les modifications"}
                </Button>
              )}
            </div>
          )
        }
      >
        {mode === "update" && !selectedCampaign ? (
          <p className="text-sm text-muted-foreground">
            Campagne non trouvée. Fermez ce volet et sélectionnez un autre projet.
          </p>
        ) : (
          <form
            id="project-wizard-form"
            onSubmit={onSubmit}
            className="flex w-full max-w-2xl flex-col gap-6"
          >
            <ProjectWizardHorizontalStepper
              steps={WIZARD_STEP_LABELS}
              currentIndex={step}
            />

            {step === 0 && (
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="proj-title">Nom du projet</Label>
                  <Input
                    id="proj-title"
                    placeholder="ex: Ferme Solaire de Thies"
                    {...form.register("title")}
                  />
                  {form.formState.errors.title && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.title.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="proj-sector">{"Secteur d'activité"}</Label>
                    <Select
                      value={form.watch("sector")}
                      onValueChange={(v) =>
                        form.setValue("sector", v, { shouldValidate: true })
                      }
                    >
                      <SelectTrigger id="proj-sector">
                        <SelectValue placeholder="Sélectionner un secteur" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AGRICULTURE">Agriculture</SelectItem>
                        <SelectItem value="ENERGY">Énergie</SelectItem>
                        <SelectItem value="INFRASTRUCTURE">
                          Infrastructure
                        </SelectItem>
                        <SelectItem value="TECHNOLOGY">Technologie</SelectItem>
                        <SelectItem value="HEALTH">Santé</SelectItem>
                        <SelectItem value="EDUCATION">Éducation</SelectItem>
                        <SelectItem value="REAL_ESTATE">Immobilier</SelectItem>
                        <SelectItem value="MANUFACTURING">Industrie</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.sector && (
                      <p className="text-xs text-destructive">
                        {form.formState.errors.sector.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="proj-owner">Porteur de projet</Label>
                    <Input
                      id="proj-owner"
                      placeholder="Nom de l'entité ou personne"
                      {...form.register("projectOwner")}
                    />
                    {form.formState.errors.projectOwner && (
                      <p className="text-xs text-destructive">
                        {form.formState.errors.projectOwner.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proj-tags">Étiquettes</Label>
                  <TagsInput
                    value={form.watch("tags")}
                    onChange={(tags) =>
                      form.setValue("tags", tags, { shouldValidate: true })
                    }
                    placeholder="Ajouter des étiquettes (Entrée ou virgule pour ajouter)"
                    disabled={busy}
                  />
                  <p className="text-xs text-muted-foreground">
                    Ajoutez des mots-clés pour aider les investisseurs à
                    découvrir votre projet
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proj-summary">Résumé</Label>
                  <Input
                    id="proj-summary"
                    placeholder="Courte description du projet"
                    {...form.register("summary")}
                  />
                  {form.formState.errors.summary && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.summary.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proj-desc">Description détaillée</Label>
                  <textarea
                    id="proj-desc"
                    className={textareaClassName}
                    placeholder="Décrivez votre projet en détail..."
                    {...form.register("description")}
                  />
                  {form.formState.errors.description && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.description.message}
                    </p>
                  )}
                </div>

                {/* Pro Tip Card */}
                <div className="rounded-lg border border-deep-green/20 bg-deep-green/5 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-deep-green/10">
                      <svg
                        className="h-4 w-4 text-deep-green"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-deep-green">
                        Conseils Pro
                      </p>
                      <p className="mt-1 text-xs text-foreground/70">
                        Un nom de projet clair et un secteur bien défini
                        augmentent le taux de clic des investisseurs de 40%.
                      </p>
                      <p className="mt-2 text-xs font-medium text-deep-green/80">
                        EXEMPLE RECOMMANDÉ
                      </p>
                      <p className="mt-1 text-xs italic text-foreground/60">
                        {"“Irrigation Connectée - Sahel IWRT”"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="grid gap-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="proj-goal">Objectif de financement</Label>
                    <Input
                      id="proj-goal"
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
                    <Label htmlFor="proj-currency">Devise</Label>
                    <Input
                      id="proj-currency"
                      maxLength={12}
                      {...form.register("currency")}
                    />
                    {form.formState.errors.currency && (
                      <p className="text-xs text-destructive">
                        {form.formState.errors.currency.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="proj-start">Débute (optionnel)</Label>
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
                    <Label htmlFor="proj-end">Finit (optionnel)</Label>
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
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Statut</Label>
                  <Select
                    value={form.watch("status")}
                    onValueChange={(v) =>
                      form.setValue("status", v as FormValues["status"], {
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Statut" />
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
                <div className="flex items-start gap-3 rounded-lg border p-3">
                  <Checkbox
                    id="proj-featured"
                    checked={form.watch("isFeatured")}
                    onCheckedChange={(v) =>
                      form.setValue("isFeatured", v === true, {
                        shouldValidate: true,
                      })
                    }
                  />
                  <div className="space-y-1">
                    <Label htmlFor="proj-featured">Campagne à la une</Label>
                    <p className="text-xs text-muted-foreground">
                      Les campagnes à la une sont prioritaires dans les vitrines publiques.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-2">
                <Label>Image de couverture</Label>
                <FileDropZone
                  accept="image/*"
                  remoteUrl={form.watch("coverImageUrl")?.trim() || null}
                  isUploading={uploading}
                  disabled={busy}
                  onFileSelect={uploadCover}
                  onClear={() => {
                    const current = form.getValues("coverImageUrl")?.trim();
                    form.setValue("coverImageUrl", "");
                    if (current) {
                      void deleteCoverByUrl(current);
                    }
                  }}
                  hint="Faites glisser une image ou cliquez. Les téléchargements utilisent le même flux Cloudinary que les annonces administrateur."
                />
                <input type="hidden" {...form.register("coverImageUrl")} />
              </div>
            )}
          </form>
        )}
      </FullTopSheet>
    </div>
  );
}
