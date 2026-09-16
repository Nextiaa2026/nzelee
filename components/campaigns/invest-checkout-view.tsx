"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Building2,
  CreditCard,
  Lock,
  ShieldCheck,
  Smartphone,
  Sprout,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { z } from "zod";
import { toast } from "sonner";

import {
  CampaignCurrencyToggle,
  CampaignDisplayCurrencyProvider,
  useCampaignDisplayCurrency,
} from "@/components/campaigns/campaign-currency-toggle";
import { GalleryLightbox } from "@/components/campaigns/gallery-lightbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { formatDateRange } from "@/lib/format/date";
import { SITE_NAME } from "@/lib/brand";
import { userInvestmentQueryKeys } from "@/lib/query-keys/admin";
import { currencyMinorExponent } from "@/lib/services/exchange-rate";
import {
  buildInvestmentCheckoutCallbackUrl,
  createMyInvestment,
} from "@/lib/services/user-investments";
import { investmentCommitmentSchema } from "@/lib/validations/marketing-forms";
import type { UserCreateInvestmentBody } from "@/lib/validations/user-investment";
import { investmentCurrencyCodes } from "@/lib/validations/user-investment";

type Values = z.infer<typeof investmentCommitmentSchema>;

export type InvestCheckoutCampaign = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  activitySector: string | null;
  coverImageUrl: string | null;
  galleryImages: Array<{ url: string; alt?: string }>;
  currency: string;
  raisedAmount: number;
  goalAmount: number;
  startsAt: string | null;
  endsAt: string | null;
  investorsCount: number;
  reviewsCount: number;
};

type PaymentUi = "mobile" | "card" | "bank";

function presetAmountsForCurrency(currency: string): number[] {
  const c = currency.toUpperCase();
  if (c === "XAF" || c === "XOF") return [25_000, 50_000, 100_000, 250_000];
  if (c === "JPY") return [5000, 10_000, 25_000, 50_000];
  if (c === "NGN" || c === "GHS" || c === "KES")
    return [5000, 10_000, 25_000, 50_000];
  return [25, 50, 100, 250];
}

function sectorLabel(sector: string | null) {
  if (!sector?.trim()) return null;
  return sector.trim().replace(/_/g, " ").toUpperCase();
}

function heroSrc(c: InvestCheckoutCampaign) {
  const cover = c.coverImageUrl?.trim();
  if (cover) return cover;
  return c.galleryImages[0]?.url?.trim() ?? null;
}

function investmentErrorMessage(message: string) {
  if (message.includes("invest in your own campaign")) {
    return "Vous ne pouvez pas investir dans votre propre campagne.";
  }
  return message;
}

function impactCopy(amount: number, currency: string) {
  if (amount <= 0) {
    return "Choisissez un montant pour voir l’impact estimé de votre participation.";
  }
  const formatted = amount.toLocaleString("fr-FR", { maximumFractionDigits: 0 });
  return `Avec ${formatted} ${currency}, vous soutenez concrètement le déploiement du projet : équipement, accompagnement local et suivi des résultats. Chaque contribution compte.`;
}

function CheckoutSummary({
  campaign,
  amountMajor,
  isSubmitting,
}: {
  campaign: InvestCheckoutCampaign;
  amountMajor: number;
  isSubmitting: boolean;
}) {
  const { convertFromBase, formatInDisplay } = useCampaignDisplayCurrency();
  const goal = convertFromBase(campaign.goalAmount);
  const progress =
    campaign.goalAmount > 0
      ? Math.min(
          100,
          Math.round((campaign.raisedAmount / campaign.goalAmount) * 100),
        )
      : 0;
  const sector = sectorLabel(campaign.activitySector);
  const img = heroSrc(campaign);
  const lightboxImages = React.useMemo(() => {
    const seen = new Set<string>();
    const out: Array<{ url: string; alt: string }> = [];
    const push = (url: string | null | undefined, alt: string) => {
      const u = url?.trim();
      if (!u || seen.has(u)) return;
      seen.add(u);
      out.push({ url: u, alt });
    };
    push(img, campaign.title);
    for (const [i, g] of campaign.galleryImages.entries()) {
      push(g.url, g.alt || `${campaign.title} — ${i + 1}`);
    }
    return out;
  }, [campaign.galleryImages, campaign.title, img]);
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);
  const exp = currencyMinorExponent(campaign.currency);
  const totalBaseMinor = Math.round(amountMajor * 10 ** exp);
  const totalDisplayMinor = convertFromBase(totalBaseMinor);
  const totalLabel = formatInDisplay(totalDisplayMinor);
  const investLine =
    amountMajor > 0 ? formatInDisplay(totalDisplayMinor) : "—";

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-2xl border border-deep-green/10 bg-white shadow-sm">
        <button
          type="button"
          disabled={!img}
          onClick={() => img && setLightboxIndex(0)}
          className="relative aspect-[21/9] w-full bg-deep-green/10 text-left md:aspect-[2/1]"
        >
          {img ? (
            <Image
              src={img}
              alt={campaign.title}
              fill
              className="object-cover transition hover:scale-[1.02]"
              sizes="(max-width: 1024px) 100vw, 400px"
              priority
            />
          ) : (
            <div className="flex h-full min-h-[120px] items-center justify-center text-sm text-deep-green/40">
              Aucune image de campagne
            </div>
          )}
        </button>
        <div className="space-y-5 p-6">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h2 className="font-sans text-xl font-semibold text-deep-green">
              {campaign.title}
            </h2>
            {sector ? (
              <span className="shrink-0 rounded-full bg-mint/25 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-deep-green">
                {sector}
              </span>
            ) : null}
          </div>

          <div>
            <div className="flex items-center justify-between gap-2 text-xs text-deep-green/50">
              <span>Objectif</span>
              <span className="font-medium text-deep-green">
                {formatInDisplay(goal)}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-200">
              <div
                className="h-full rounded-full bg-mint"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-deep-green/45">{progress}% financé</p>
          </div>

          <CampaignCurrencyToggle className="border-t border-deep-green/10 pt-4" />

          <div className="space-y-3 border-t border-deep-green/10 pt-4 text-sm">
            <div className="flex justify-between text-deep-green/70">
              <span>{"Montant d'investissement"}</span>
              <span className="font-semibold text-deep-green">{investLine}</span>
            </div>
            <div className="flex justify-between text-deep-green/70">
              <span>Frais de plateforme</span>
              <span className="font-semibold text-deep-green">Offerts</span>
            </div>
            <div className="flex justify-between border-t border-deep-green/10 pt-3 text-base font-semibold text-deep-green">
              <span>Total à payer</span>
              <span>{amountMajor > 0 ? totalLabel : "—"}</span>
            </div>
          </div>

          <Button
            type="submit"
            form="invest-checkout-form"
            disabled={isSubmitting}
            className="w-full rounded-full bg-deep-green py-5 text-base font-semibold text-white shadow-sm hover:bg-deep-green/90"
          >
            <Lock className="mr-2 inline size-4" aria-hidden />
            {isSubmitting ? "Envoi…" : "Confirmer l'investissement"}
          </Button>
          <p className="text-center text-[11px] text-deep-green/45">
            Transaction protégée par chiffrement 256-bit
          </p>
        </div>
      </div>

      {lightboxImages.length > 1 ? (
        <div className="rounded-2xl border border-deep-green/10 bg-white p-4 shadow-sm">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-deep-green/45">
            Galerie
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {lightboxImages.slice(0, 8).map((g, i) => (
              <button
                key={`${g.url}-${i}`}
                type="button"
                onClick={() => setLightboxIndex(i)}
                className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-neutral-100 ring-1 ring-deep-green/10 transition hover:ring-deep-green/35"
              >
                <Image
                  src={g.url}
                  alt={g.alt}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <GalleryLightbox
        images={lightboxImages}
        openIndex={lightboxIndex}
        onOpenChange={setLightboxIndex}
      />
    </div>
  );
}

function InvestCheckoutInner({
  campaign,
  kycApproved,
  redirectAfterSuccess,
}: {
  campaign: InvestCheckoutCampaign;
  kycApproved: boolean;
  redirectAfterSuccess: string;
}) {
  const router = useRouter();
  const qc = useQueryClient();
  const presets = useMemo(
    () => presetAmountsForCurrency(campaign.currency),
    [campaign.currency],
  );

  const safeCurrency = investmentCurrencyCodes.includes(
    campaign.currency.toUpperCase() as (typeof investmentCurrencyCodes)[number],
  )
    ? (campaign.currency.toUpperCase() as Values["currency"])
    : ("XAF" as Values["currency"]);

  const form = useForm<Values>({
    resolver: zodResolver(investmentCommitmentSchema) as never,
    defaultValues: {
      listingSlug: campaign.slug,
      amount: presets[1] ?? 50_000,
      currency: safeCurrency,
      paymentMethod: "MOBILE_MONEY",
      note: "",
    },
  });

  const amount = useWatch({ control: form.control, name: "amount" }) ?? 0;
  const paymentMethod = useWatch({
    control: form.control,
    name: "paymentMethod",
  });
  const [paymentUi, setPaymentUi] = React.useState<PaymentUi>("mobile");
  const [mobilePhone, setMobilePhone] = React.useState("");

  const mutation = useMutation({
    mutationFn: async (values: Values) => {
      const body: UserCreateInvestmentBody = {
        campaignRef: values.listingSlug.trim(),
        amount: Math.round(
          values.amount * 10 ** currencyMinorExponent(values.currency),
        ),
        sourceCurrency: values.currency,
        paymentMethod: values.paymentMethod,
        note: values.note?.trim() || undefined,
        checkoutCallbackUrl: buildInvestmentCheckoutCallbackUrl(),
      };
      return createMyInvestment(body);
    },
    onSuccess: async (res, values) => {
      if (!("ok" in res) || !res.ok) {
        const raw = res.error?.message ?? "Échec du paiement";
        toast.error(investmentErrorMessage(raw));
        return;
      }
      const checkoutUrl = res.data.notch?.authorizationUrl;
      if (checkoutUrl) {
        toast.success("Redirection vers Notch Pay", {
          description: `${values.amount.toLocaleString("fr-FR")} ${values.currency} — finalisez le paiement sur la page sécurisée.`,
        });
        await qc.invalidateQueries({ queryKey: userInvestmentQueryKeys.list() });
        await qc.invalidateQueries({ queryKey: ["admin", "campaigns"] });
        window.location.assign(checkoutUrl);
        return;
      }
      toast.success("Engagement enregistré", {
        description: `${values.amount.toLocaleString("fr-FR")} ${values.currency}.`,
      });
      await qc.invalidateQueries({ queryKey: userInvestmentQueryKeys.list() });
      await qc.invalidateQueries({ queryKey: ["admin", "campaigns"] });
      router.push(redirectAfterSuccess);
    },
    onError: () => toast.error("Impossible de confirmer l’investissement"),
  });

  const isBusy = form.formState.isSubmitting || mutation.isPending;

  const onSubmit = form.handleSubmit((values) => {
    if (!kycApproved) {
      toast.error("Vérification d’identité requise");
      router.push("/kyc");
      return;
    }
    if (paymentUi === "card" || paymentUi === "bank") {
      return;
    }
    const digits = mobilePhone.replace(/\D/g, "");
    if (digits.length < 8) {
      toast.error("Indiquez un numéro de téléphone valide pour Mobile Money.");
      return;
    }
    mutation.mutate(values);
  });

  const setPreset = (n: number) => {
    form.setValue("amount", n, { shouldValidate: true });
  };

  return (
    <div className="min-h-svh bg-neutral-100 font-sans">
      <header className="border-b border-deep-green/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <Link
            href={`/campaigns/${campaign.slug}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-deep-green/60 transition-colors hover:text-deep-green"
          >
            <ArrowLeft className="size-4" />
            Retour
          </Link>
          <span className="font-sans text-lg font-semibold tracking-tight text-deep-green">
            {SITE_NAME}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-deep-green/50">
            <ShieldCheck className="size-4 text-mint" />
            Paiement sécurisé
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
          <div className="min-w-0 space-y-6">
            <section className="rounded-2xl border border-deep-green/10 bg-white p-6 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-deep-green/45">
                Projet
              </p>
              <h1 className="mt-2 font-sans text-2xl font-semibold text-deep-green md:text-3xl">
                {campaign.title}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-deep-green/70">
                {campaign.summary}
              </p>
              <p className="mt-3 text-xs text-deep-green/45">
                Fenêtre : {formatDateRange(campaign.startsAt, campaign.endsAt)}
              </p>
            </section>

            {!kycApproved ? (
              <div className="rounded-2xl border border-destructive/25 bg-destructive/5 p-6 text-destructive">
                <p className="font-sans text-lg font-semibold">
                  {"Vérification d'identité requise"}
                </p>
                <p className="mt-2 text-sm opacity-80">
                  Complétez votre KYC pour investir en toute conformité.
                </p>
                <Button
                  asChild
                  className="mt-4 bg-deep-green text-white hover:bg-deep-green/90"
                >
                  <Link href="/kyc">Compléter le KYC</Link>
                </Button>
              </div>
            ) : null}

            <form
              id="invest-checkout-form"
              className="space-y-8 rounded-2xl border border-deep-green/10 bg-white p-6 shadow-sm"
              onSubmit={onSubmit}
            >
              <input type="hidden" {...form.register("listingSlug")} />
              <input type="hidden" {...form.register("currency")} />

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-deep-green/45">
                  {"Processus d'investissement"}
                </p>
                <h2 className="mt-2 font-sans text-xl font-semibold text-deep-green">
                  Configurez votre contribution
                </h2>
              </div>

              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-deep-green">
                  1. Choisissez votre montant
                </h3>
                <div className="flex flex-wrap gap-2">
                  {presets.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPreset(n)}
                      className={cn(
                        "rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors",
                        amount === n
                          ? "border-deep-green bg-deep-green text-white"
                          : "border-deep-green/15 bg-neutral-50 text-deep-green hover:border-deep-green/30",
                      )}
                    >
                      {n.toLocaleString("fr-FR")} {campaign.currency}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="inv-custom-amount"
                    className="text-deep-green/70"
                  >
                    Montant personnalisé ({campaign.currency})
                  </Label>
                  <Input
                    id="inv-custom-amount"
                    type="number"
                    min={1}
                    step={
                      currencyMinorExponent(campaign.currency) === 0
                        ? 1
                        : "0.01"
                    }
                    className="h-12 max-w-md rounded-xl border-deep-green/15 bg-white"
                    value={Number.isFinite(amount) ? amount : ""}
                    onChange={(e) => {
                      const v = Number.parseFloat(e.target.value);
                      form.setValue(
                        "amount",
                        Number.isFinite(v) && v > 0 ? v : 0,
                        { shouldValidate: true },
                      );
                    }}
                  />
                  {form.formState.errors.amount && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.amount.message}
                    </p>
                  )}
                </div>
                <div className="flex gap-3 rounded-xl border border-mint/30 bg-mint/15 p-4">
                  <Sprout
                    className="mt-0.5 size-5 shrink-0 text-deep-green"
                    aria-hidden
                  />
                  <p className="text-sm leading-relaxed text-deep-green/90">
                    {impactCopy(amount, campaign.currency)}
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-deep-green">
                  2. Mode de paiement
                </h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  {(
                    [
                      {
                        id: "mobile" as const,
                        label: "Mobile Money",
                        icon: Smartphone,
                      },
                      {
                        id: "card" as const,
                        label: "Carte bancaire",
                        icon: CreditCard,
                      },
                      {
                        id: "bank" as const,
                        label: "Virement",
                        icon: Building2,
                      },
                    ] as const
                  ).map(({ id, label, icon: Icon }) =>
                    id === "mobile" ? (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          setPaymentUi("mobile");
                          form.setValue("paymentMethod", "MOBILE_MONEY", {
                            shouldValidate: true,
                          });
                        }}
                        className={cn(
                          "relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center text-sm font-medium transition-colors",
                          paymentUi === "mobile"
                            ? "border-mint bg-mint/15 text-deep-green"
                            : "border-deep-green/10 bg-neutral-50 text-deep-green/70 hover:border-deep-green/25",
                        )}
                      >
                        <Icon className="size-6" strokeWidth={1.75} />
                        {label}
                      </button>
                    ) : (
                      <div
                        key={id}
                        className="relative flex flex-col items-center gap-2 rounded-xl border border-dashed border-deep-green/15 bg-neutral-50 p-4 text-center text-sm text-deep-green/45"
                      >
                        <Badge
                          variant="secondary"
                          className="absolute right-2 top-2 border-deep-green/10 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-deep-green/60"
                        >
                          Bientôt
                        </Badge>
                        <Icon
                          className="size-6 opacity-50"
                          strokeWidth={1.75}
                        />
                        <span className="font-medium text-deep-green/55">
                          {label}
                        </span>
                      </div>
                    ),
                  )}
                </div>

                {paymentUi === "mobile" ? (
                  <div className="space-y-4 rounded-xl border border-deep-green/10 bg-neutral-50 p-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-deep-green/50">
                      Sélectionnez votre opérateur
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <label
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-xl border bg-white px-4 py-3",
                          paymentMethod === "ORANGE_MONEY"
                            ? "border-mint ring-2 ring-mint/30"
                            : "border-deep-green/10",
                        )}
                      >
                        <input
                          type="radio"
                          name="operator"
                          className="accent-mint shrink-0"
                          checked={paymentMethod === "ORANGE_MONEY"}
                          onChange={() =>
                            form.setValue("paymentMethod", "ORANGE_MONEY", {
                              shouldValidate: true,
                            })
                          }
                        />
                        <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#121921] ring-1 ring-deep-green/10">
                          <Image
                            src="/orange-money-seeklogo.png"
                            alt=""
                            width={40}
                            height={40}
                            className="object-contain p-1"
                          />
                        </span>
                        <span className="text-sm font-medium text-deep-green">
                          Orange Money
                        </span>
                      </label>
                      <label
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-xl border bg-white px-4 py-3",
                          paymentMethod === "MOBILE_MONEY"
                            ? "border-mint ring-2 ring-mint/30"
                            : "border-deep-green/10",
                        )}
                      >
                        <input
                          type="radio"
                          name="operator"
                          className="accent-mint shrink-0"
                          checked={paymentMethod === "MOBILE_MONEY"}
                          onChange={() =>
                            form.setValue("paymentMethod", "MOBILE_MONEY", {
                              shouldValidate: true,
                            })
                          }
                        />
                        <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#004f71] ring-1 ring-deep-green/10">
                          <Image
                            src="/mtn-momo-icon-seeklogo.png"
                            alt=""
                            width={40}
                            height={40}
                            className="object-contain p-1"
                          />
                        </span>
                        <span className="text-sm font-medium text-deep-green">
                          MTN MoMo
                        </span>
                      </label>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inv-phone" className="text-deep-green/70">
                        Numéro de téléphone
                      </Label>
                      <Input
                        id="inv-phone"
                        type="tel"
                        name="mobile-phone"
                        inputMode="tel"
                        autoComplete="tel"
                        enterKeyHint="done"
                        placeholder="+225 07 00 00 00 00"
                        value={mobilePhone}
                        onChange={(e) => setMobilePhone(e.target.value)}
                        className="h-11 max-w-md rounded-xl border-deep-green/15 bg-white font-mono text-base tabular-nums tracking-wide"
                        aria-invalid={
                          mobilePhone.length > 0 &&
                          mobilePhone.replace(/\D/g, "").length < 8
                        }
                      />
                      <p className="text-[11px] text-deep-green/50">
                        Vous recevrez une notification sur votre appareil pour
                        valider la transaction.
                      </p>
                    </div>
                  </div>
                ) : null}
              </section>

              <div className="space-y-2">
                <Label htmlFor="inv-note" className="text-deep-green/70">
                  Note (optionnel)
                </Label>
                <textarea
                  id="inv-note"
                  rows={3}
                  className="w-full rounded-xl border border-deep-green/15 bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-mint/40"
                  placeholder="Questions, précisions…"
                  {...form.register("note")}
                />
              </div>

              <p className="text-xs text-deep-green/45">
                En confirmant, vous acceptez les conditions applicables aux
                investissements sur {SITE_NAME}.
              </p>
            </form>
          </div>

          <aside className="min-w-0 lg:sticky lg:top-6">
            <CheckoutSummary
              campaign={campaign}
              amountMajor={amount}
              isSubmitting={isBusy}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}

export function InvestCheckoutView({
  campaign,
  rates,
  kycApproved,
  redirectAfterSuccess = "/dashboard/investments",
}: {
  campaign: InvestCheckoutCampaign;
  rates: Record<string, number>;
  kycApproved: boolean;
  redirectAfterSuccess?: string;
}) {
  return (
    <CampaignDisplayCurrencyProvider
      baseCurrency={campaign.currency}
      rates={rates}
    >
      <InvestCheckoutInner
        campaign={campaign}
        kycApproved={kycApproved}
        redirectAfterSuccess={redirectAfterSuccess}
      />
    </CampaignDisplayCurrencyProvider>
  );
}
