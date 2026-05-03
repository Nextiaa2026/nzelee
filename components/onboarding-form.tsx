"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { CountrySelect } from "@/components/country-select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCompleteOnboarding } from "@/hooks/use-onboarding-api";
import { onboardingSchema, type OnboardingData } from "@/lib/onboarding-schema";
import { investmentCurrencyCodes } from "@/lib/validations/user-investment";
import { ageFromDateOfBirth, cn } from "@/lib/utils";

export const ONBOARDING_STEP_COUNT = 6;

type OnboardingFormProps = {
  step: number;
  onStepChange: (step: number) => void;
};

const CURRENCY_CODES = investmentCurrencyCodes as readonly string[];

export function OnboardingForm({ step, onStepChange }: OnboardingFormProps) {
  const { data: session, update } = useSession();
  const [error, setError] = useState<string | null>(null);
  const completeOnboardingMutation = useCompleteOnboarding();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      displayName: "",
      country: "",
      dateOfBirth: "",
      currency: undefined as unknown as OnboardingData["currency"],
    },
    mode: "onChange",
  });

  const displayName = watch("displayName");
  const country = watch("country");
  const dateOfBirth = watch("dateOfBirth");
  const currency = watch("currency");

  useEffect(() => {
    if (session?.user?.name && !displayName) {
      setValue("displayName", session.user.name, { shouldValidate: true });
    }
  }, [session?.user?.name, displayName, setValue]);

  const dobDate = dateOfBirth ? new Date(dateOfBirth) : undefined;
  const reviewAge = dobDate ? ageFromDateOfBirth(dobDate) : null;

  const isStepSatisfied = (stepIndex: number) => {
    if (stepIndex === 0) {
      return displayName.trim().length >= 2 && !errors.displayName;
    }
    if (stepIndex === 1) {
      return country.length === 2 && !errors.country;
    }
    if (stepIndex === 2) {
      if (!dateOfBirth || !/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) return false;
      if (errors.dateOfBirth) return false;
      if (!dobDate) return false;
      const age = ageFromDateOfBirth(dobDate);
      return age >= 18 && age <= 120;
    }
    if (stepIndex === 3) {
      return Boolean(currency && CURRENCY_CODES.includes(currency) && !errors.currency);
    }
    return true;
  };

  const canJumpToStep = useMemo(() => {
    return (target: number) => {
      if (target <= step) return true;
      for (let i = 0; i < target; i += 1) {
        if (!isStepSatisfied(i)) return false;
      }
      return true;
    };
  }, [step, displayName, country, dateOfBirth, currency, errors, dobDate]);

  const stepValid = isStepSatisfied(step);

  const onSubmit = async (
    data: OnboardingData,
    options?: { thenNavigate?: "/kyc" },
  ) => {
    setError(null);
    completeOnboardingMutation.mutate(data, {
      onSuccess: async () => {
        // Force a full session update and page reload to break potential redirect loops
        // between the server layout and client-side routing state.
        await update();
        if (options?.thenNavigate) {
          window.location.href = options.thenNavigate;
        } else {
          window.location.href = "/dashboard";
        }
      },
      onError: (e) => {
        setError(e instanceof Error ? e.message : "Impossible d'enregistrer. Réessayez.");
      },
    });
  };

  const handleNext = async () => {
    if (step >= ONBOARDING_STEP_COUNT - 1) return;

    if (step <= 2) {
      const field =
        step === 0 ? "displayName" : step === 1 ? "country" : "dateOfBirth";
      const ok = await trigger(field, { shouldFocus: true });
      if (!ok) return;
      onStepChange(step + 1);
      return;
    }

    if (step === 3) {
      const ok = await trigger("currency", { shouldFocus: true });
      if (!ok) return;
      onStepChange(step + 1);
      return;
    }

    if (step === 4) {
      const ok = await trigger(undefined, { shouldFocus: true });
      if (!ok) return;
      onStepChange(step + 1);
      return;
    }
  };

  const isKycStep = step === ONBOARDING_STEP_COUNT - 1;

  return (
    <div className="w-full max-w-md space-y-6 text-left">
      <div className="relative min-h-[140px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="space-y-6"
          >
            {step === 0 ? (
              <div className="space-y-1.5 sm:space-y-2">
                <Label
                  htmlFor="displayName"
                  className="text-sm font-semibold text-black"
                >
                  Nom d&apos;affichage
                </Label>
                <Input
                  id="displayName"
                  {...register("displayName")}
                  placeholder="Votre nom"
                  autoComplete="name"
                  className={cn(
                    errors.displayName && "border-red-500/50 bg-red-500/[0.02]",
                  )}
                />
                {errors.displayName ? (
                  <p className="text-[11px] text-red-500">
                    {errors.displayName.message}
                  </p>
                ) : (
                  <p className="text-xs text-black/40">
                    Affiché sur votre profil ; vous pouvez le changer à tout moment.
                  </p>
                )}
              </div>
            ) : null}

            {step === 1 ? (
              <div className="space-y-2">
                <Label
                  htmlFor="country"
                  className="text-sm font-semibold text-black"
                >
                  Pays
                </Label>
                <CountrySelect
                  id="country"
                  value={country}
                  onValueChange={(val) =>
                    setValue("country", val, { shouldValidate: true })
                  }
                  disabled={completeOnboardingMutation.isPending}
                />
                {errors.country && (
                  <p className="text-[11px] text-red-500">
                    {errors.country.message}
                  </p>
                )}
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-1.5 sm:space-y-2">
                <Label
                  htmlFor="dateOfBirth"
                  className="text-sm font-semibold text-black"
                >
                  Date de naissance
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-11 bg-black/4 border-0 hover:bg-black/6 transition-colors",
                        !dateOfBirth && "text-black/45",
                        errors.dateOfBirth && "ring-1 ring-red-500/30",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                      {dobDate ? (
                        format(dobDate, "PPP")
                      ) : (
                        <span>Choisir une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dobDate}
                      onSelect={(date) =>
                        setValue(
                          "dateOfBirth",
                          date ? date.toISOString().slice(0, 10) : "",
                          { shouldValidate: true },
                        )
                      }
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                {errors.dateOfBirth ? (
                  <p className="text-[11px] text-red-500">
                    {errors.dateOfBirth.message}
                  </p>
                ) : (
                  <p className="text-[11px] leading-tight text-black/40">
                    Doit avoir 18 ans et plus. Utilisez la même date que sur votre pièce d&apos;identité pour
                    la vérification ultérieure.
                  </p>
                )}
              </div>
            ) : null}

            {step === 3 ? (
              <div className="space-y-2">
                <Label
                  htmlFor="currency"
                  className="text-sm font-semibold text-black"
                >
                  Devise préférée
                </Label>
                <Select
                  value={currency ?? ""}
                  onValueChange={(val) =>
                    setValue("currency", val as OnboardingData["currency"], {
                      shouldValidate: true,
                    })
                  }
                  disabled={completeOnboardingMutation.isPending}
                >
                  <SelectTrigger
                    id="currency"
                    className={cn(
                      "h-11 w-full rounded-xl border-0 bg-black/4 hover:bg-black/6",
                      errors.currency && "ring-1 ring-red-500/30",
                    )}
                  >
                    <SelectValue placeholder="Sélectionnez une devise" />
                  </SelectTrigger>
                  <SelectContent>
                    {investmentCurrencyCodes.map((code) => (
                      <SelectItem key={code} value={code}>
                        {code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.currency ? (
                  <p className="text-[11px] text-red-500">{errors.currency.message}</p>
                ) : (
                  <p className="text-xs text-black/40">
                    Utilisée pour les montants et les résumés sur votre compte.
                  </p>
                )}
              </div>
            ) : null}

            {step === 4 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-black/5 bg-black/[0.01] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-black/30">
                      Nom
                    </span>
                    <p className="mt-1 text-base font-semibold text-black">
                      {displayName || "—"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-black/5 bg-black/[0.01] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-black/30">
                      Pays
                    </span>
                    <p className="mt-1 text-base font-semibold text-black">
                      {country || "—"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-black/5 bg-black/[0.01] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-black/30">
                      Âge
                    </span>
                    <p className="mt-1 text-base font-semibold text-black">
                      {reviewAge !== null ? `${reviewAge} ans` : "—"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-black/5 bg-black/[0.01] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-black/30">
                      Devise
                    </span>
                    <p className="mt-1 text-base font-semibold text-black">
                      {currency || "—"}
                    </p>
                  </div>
                </div>
                <p className="pt-2 text-center text-sm text-black/50">
                  Continuez pour terminer la configuration. Vous pouvez vérifier votre identité maintenant ou
                  plus tard depuis votre tableau de bord.
                </p>
              </div>
            ) : null}

            {step === 5 ? (
              <div className="space-y-6">
                <div className="mx-auto max-w-sm rounded-3xl border border-black/5 bg-black/[0.01] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                  <p className="text-sm font-semibold text-black">
                    Avant de commencer
                  </p>
                  <ul className="mt-3 space-y-3 text-sm text-black/60">
                    <li className="flex items-center gap-3">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />
                      Pièce d&apos;identité avec photo
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />
                      Selfie ou étape de vivacité
                    </li>
                  </ul>
                </div>
              </div>
            ) : null}
            {error ? (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-medium text-red-500"
              >
                {error}
              </motion.p>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="space-y-4 border-t border-black/5 pt-6">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center gap-3">
            {Array.from({ length: ONBOARDING_STEP_COUNT }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  if (canJumpToStep(i)) onStepChange(i);
                }}
                disabled={!canJumpToStep(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  i === step
                    ? "w-8 bg-mint"
                    : i < step
                      ? "w-1.5 bg-mint/30 hover:bg-mint/50"
                      : "w-1.5 bg-black/10 hover:bg-black/20",
                )}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex w-full flex-wrap items-center justify-between gap-3 sm:flex-nowrap">
            <Button
              type="button"
              variant="ghost"
              className="rounded-full px-8 text-black/40 hover:bg-black/4 hover:text-black transition-colors"
              disabled={step === 0 || completeOnboardingMutation.isPending}
              onClick={() => onStepChange(Math.max(0, step - 1))}
            >
              Retour
            </Button>

            {isKycStep ? (
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-full px-4 text-black/40 hover:bg-black/4 hover:text-black transition-colors"
                  disabled={completeOnboardingMutation.isPending}
                  onClick={handleSubmit((data) => onSubmit(data))}
                >
                  Terminer sans KYC
                </Button>
                <Button
                  type="button"
                  className="rounded-full bg-mint px-5 font-semibold text-mint-foreground shadow-[0_10px_20px_-5px_rgba(15,130,97,0.25)] hover:bg-mint/90 active:scale-95 transition-all sm:px-8"
                  disabled={completeOnboardingMutation.isPending}
                  onClick={handleSubmit((data) =>
                    onSubmit(data, { thenNavigate: "/kyc" }),
                  )}
                >
                  {completeOnboardingMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Enregistrer & vérifier l'identité"
                  )}
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                className="rounded-full bg-mint px-10 font-semibold text-mint-foreground shadow-[0_10px_20px_-5px_rgba(15,130,97,0.25)] hover:bg-mint/90 active:scale-95 transition-all"
                disabled={!stepValid || completeOnboardingMutation.isPending}
                onClick={() => void handleNext()}
              >
                Continuer
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
