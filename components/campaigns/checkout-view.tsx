"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ChevronLeftIcon,
  LockIcon,
  CreditCardIcon,
  SmartphoneIcon,
  BuildingIcon,
} from "lucide-react";
import Link from "next/link";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_NAME } from "@/lib/brand";

type Campaign = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  coverImageUrl: string | null;
  raisedAmount: number;
  goalAmount: number;
  currency: string;
  status: string;
};

type CheckoutViewProps = {
  campaign: Campaign;
  kycApproved: boolean;
};

const checkoutSchema = z
  .object({
    amount: z.string().min(1, "Amount is required"),
    customAmount: z.string().optional(),
    paymentMethod: z.enum(["MOBILE_MONEY", "CARD", "BANK"]),
    mobileOperator: z.enum(["ORANGE_MONEY", "MTN_MOMO"]).optional(),
    phoneNumber: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.paymentMethod === "MOBILE_MONEY") {
        return (
          !!data.mobileOperator &&
          !!data.phoneNumber &&
          data.phoneNumber.length >= 8
        );
      }
      return true;
    },
    {
      message:
        "Mobile operator and valid phone number are required for mobile money payments",
      path: ["phoneNumber"],
    },
  );

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function CheckoutView({ campaign, kycApproved }: CheckoutViewProps) {
  const router = useRouter();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      amount: "50000",
      customAmount: "",
      paymentMethod: "MOBILE_MONEY",
      mobileOperator: undefined,
      phoneNumber: "",
    },
  });

  const presetAmounts = ["25000", "50000", "100000", "250000"];
  const selectedAmount = form.watch("customAmount") || form.watch("amount");
  const paymentMethod = form.watch("paymentMethod");
  const mobileOperator = form.watch("mobileOperator");

  const platformFee = Math.round(Number.parseInt(selectedAmount) * 0.0);
  const totalAmount = Number.parseInt(selectedAmount) + platformFee;

  const progress =
    campaign.goalAmount > 0
      ? Math.min(
          100,
          Math.round((campaign.raisedAmount / campaign.goalAmount) * 100),
        )
      : 0;

  const formatMoney = (amountMinor: number) => {
    return (amountMinor / 100).toLocaleString(undefined, {
      style: "currency",
      currency: campaign.currency,
      maximumFractionDigits: 0,
    });
  };

  const onSubmit = form.handleSubmit(async (data) => {
    if (!kycApproved) {
      toast.error("Please complete KYC verification first");
      router.push("/kyc");
      return;
    }

    if (data.paymentMethod !== "MOBILE_MONEY") {
      toast.info("This payment method is coming soon");
      return;
    }

    try {
      // TODO: Integrate with Notch Pay API
      // For now, simulate the payment process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Payment initiated", {
        description:
          "You will receive a prompt on your phone to confirm the payment",
      });

      // Redirect to success page or dashboard
      router.push(`/dashboard/investments`);
    } catch (error) {
      toast.error("Payment failed", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    }
  });

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link
            href={`/campaigns/${campaign.slug}`}
            className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Back
          </Link>
          <div className="flex items-center gap-2 text-sm text-foreground/60">
            <LockIcon className="h-4 w-4" />
            <span>Payment Secured</span>
          </div>
        </div>
      </header>

      <form onSubmit={onSubmit} className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Left Column - Payment Form */}
          <div className="space-y-6">
            {/* Campaign Info */}
            <Card className="overflow-hidden rounded-lg border border-foreground/10">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-lg">
                    {campaign.coverImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={campaign.coverImageUrl}
                        alt={campaign.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-deep-green/10 to-mint/10">
                        <svg
                          className="h-8 w-8 text-deep-green/30"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                    <Badge className="absolute left-2 top-2 bg-deep-green text-xs">
                      INFRASTRUCTURE
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display text-xl font-semibold">
                      {campaign.title}
                    </h2>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-xs text-foreground/60">
                        <span>
                          Objectif: {formatMoney(campaign.goalAmount)}
                        </span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-foreground/10">
                        <div
                          className="h-full bg-deep-green transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-foreground/60">
                      Montant d&apos;investissement:{" "}
                      <span className="font-semibold text-deep-green">
                        {formatMoney(Number.parseInt(selectedAmount))}
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amount Selection */}
            <Card className="rounded-lg border border-foreground/10">
              <CardContent className="p-6">
                <h3 className="mb-4 font-display text-lg font-semibold">
                  1. Choisissez votre montant
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {presetAmounts.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        form.setValue("amount", preset);
                        form.setValue("customAmount", "");
                      }}
                      className={`rounded-lg border-2 px-4 py-3 text-center font-medium transition ${
                        form.watch("amount") === preset &&
                        !form.watch("customAmount")
                          ? "border-deep-green bg-deep-green text-deep-green-foreground"
                          : "border-foreground/10 hover:border-deep-green/50"
                      }`}
                    >
                      {formatMoney(Number.parseInt(preset))}
                    </button>
                  ))}
                </div>
                <div className="mt-4">
                  <Label htmlFor="custom-amount">
                    Montant personnalisé (FCFA)
                  </Label>
                  <Input
                    id="custom-amount"
                    type="number"
                    placeholder="Entrer un montant"
                    {...form.register("customAmount")}
                    className="mt-1.5"
                  />
                  {form.formState.errors.customAmount && (
                    <p className="mt-1 text-xs text-destructive">
                      {form.formState.errors.customAmount.message}
                    </p>
                  )}
                </div>
                <div className="mt-4 rounded-lg bg-mint/10 p-3">
                  <p className="text-sm text-foreground/70">
                    💡 <strong>Votre impact immédiat</strong>
                  </p>
                  <p className="mt-1 text-xs text-foreground/60">
                    Avec {formatMoney(Number.parseInt(selectedAmount))}, vous
                    équipez une ferme familiale d&apos;une pompe solaire
                    autonome, doublant sa capacité de production annuelle.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="rounded-lg border border-foreground/10">
              <CardContent className="p-6">
                <h3 className="mb-4 font-display text-lg font-semibold">
                  2. Mode de paiement
                </h3>
                <div className="grid gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      form.setValue("paymentMethod", "MOBILE_MONEY")
                    }
                    className={`flex items-center gap-4 rounded-lg border-2 p-4 transition ${
                      paymentMethod === "MOBILE_MONEY"
                        ? "border-deep-green bg-deep-green/5"
                        : "border-foreground/10 hover:border-deep-green/50"
                    }`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-deep-green/10">
                      <SmartphoneIcon className="h-6 w-6 text-deep-green" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium">Mobile Money</p>
                      <p className="text-xs text-foreground/60">
                        Orange Money, MTN MoMo
                      </p>
                    </div>
                    {paymentMethod === "MOBILE_MONEY" && (
                      <div className="h-5 w-5 rounded-full border-4 border-deep-green" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => form.setValue("paymentMethod", "CARD")}
                    className={`flex items-center gap-4 rounded-lg border-2 p-4 transition ${
                      paymentMethod === "CARD"
                        ? "border-deep-green bg-deep-green/5"
                        : "border-foreground/10 hover:border-deep-green/50"
                    }`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                      <CreditCardIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-400">
                        Carte Bancaire
                      </p>
                      <p className="text-xs text-gray-400">Visa, Mastercard</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Coming Soon
                    </Badge>
                  </button>

                  <button
                    type="button"
                    onClick={() => form.setValue("paymentMethod", "BANK")}
                    className={`flex items-center gap-4 rounded-lg border-2 p-4 transition ${
                      paymentMethod === "BANK"
                        ? "border-deep-green bg-deep-green/5"
                        : "border-foreground/10 hover:border-deep-green/50"
                    }`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                      <BuildingIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-400">Virement</p>
                      <p className="text-xs text-gray-400">
                        Transfert bancaire
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Coming Soon
                    </Badge>
                  </button>
                </div>

                {paymentMethod === "MOBILE_MONEY" && (
                  <div className="mt-6 space-y-4 rounded-lg bg-surface-muted/50 p-4">
                    <div>
                      <Label className="mb-2 block text-sm font-medium">
                        SÉLECTIONNEZ VOTRE OPÉRATEUR
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            form.setValue("mobileOperator", "ORANGE_MONEY")
                          }
                          className={`flex items-center justify-center gap-2 rounded-lg border-2 p-3 transition ${
                            mobileOperator === "ORANGE_MONEY"
                              ? "border-deep-green bg-white"
                              : "border-foreground/10 bg-white hover:border-deep-green/50"
                          }`}
                        >
                          <div className="h-6 w-6 rounded-full bg-orange-500" />
                          <span className="font-medium">Orange Money</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            form.setValue("mobileOperator", "MTN_MOMO")
                          }
                          className={`flex items-center justify-center gap-2 rounded-lg border-2 p-3 transition ${
                            mobileOperator === "MTN_MOMO"
                              ? "border-deep-green bg-white"
                              : "border-foreground/10 bg-white hover:border-deep-green/50"
                          }`}
                        >
                          <div className="h-6 w-6 rounded-full bg-yellow-400" />
                          <span className="font-medium">MTN MoMo</span>
                        </button>
                      </div>
                      {form.formState.errors.mobileOperator && (
                        <p className="mt-1 text-xs text-destructive">
                          {form.formState.errors.mobileOperator.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone">Numéro de téléphone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+228 00 00 00 00 00"
                        {...form.register("phoneNumber")}
                        className="mt-1.5"
                      />
                      {form.formState.errors.phoneNumber && (
                        <p className="mt-1 text-xs text-destructive">
                          {form.formState.errors.phoneNumber.message}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-foreground/60">
                        Une notification sera envoyée sur votre mobile pour
                        valider la transaction.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={
                form.formState.isSubmitting || paymentMethod !== "MOBILE_MONEY"
              }
              className="w-full rounded-lg bg-deep-green py-6 text-base font-medium hover:bg-deep-green/90"
            >
              {form.formState.isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  <LockIcon className="mr-2 h-5 w-5" />
                  Confirmer l&apos;investissement
                </>
              )}
            </Button>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            <Card className="sticky top-4 rounded-lg border border-foreground/10">
              <CardContent className="p-6">
                <h3 className="mb-4 font-display text-lg font-semibold">
                  Résumé
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground/60">
                      Montant d&apos;investissement
                    </span>
                    <span className="font-medium">
                      {formatMoney(Number.parseInt(selectedAmount))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">
                      Frais de plateforme (0%)
                    </span>
                    <span className="font-medium">
                      {formatMoney(platformFee)}
                    </span>
                  </div>
                  <div className="border-t border-foreground/10 pt-3">
                    <div className="flex justify-between text-base">
                      <span className="font-semibold">Total à payer</span>
                      <span className="font-semibold text-deep-green">
                        {formatMoney(totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-lg bg-mint/10 p-4">
                  <div className="flex items-start gap-2">
                    <LockIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-mint-foreground" />
                    <div>
                      <p className="text-xs font-semibold text-mint-foreground">
                        Transaction protégée par cryptage 256-bit
                      </p>
                      <p className="mt-1 text-xs text-mint-foreground/70">
                        {SITE_NAME} utilise un cryptage de niveau bancaire et
                        des passerelles de paiement sécurisées.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial */}
            <Card className="rounded-lg border border-foreground/10 bg-gradient-to-br from-deep-green/5 to-mint/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-deep-green/20">
                    <div className="flex h-full items-center justify-center text-sm font-semibold text-deep-green">
                      M
                    </div>
                  </div>
                  <div>
                    <p className="text-sm italic text-foreground/80">
                      &ldquo;Zeller m&apos;a permis de diversifier mon épargne
                      tout en soutenant l&apos;impact direct.&rdquo;
                    </p>
                    <p className="mt-2 text-xs font-medium text-foreground/60">
                      — Moussa K., Investisseur
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </main>
  );
}
