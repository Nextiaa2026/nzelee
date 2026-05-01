"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useCompleteOnboarding } from "@/hooks/use-onboarding-api";
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
import { onboardingSchema, type OnboardingData } from "@/lib/onboarding-schema";
import { ageFromDateOfBirth, cn } from "@/lib/utils";

export const ONBOARDING_STEP_COUNT = 6;

type OnboardingFormProps = {
  step: number;
  onStepChange: (step: number) => void;
};

import { AnimatePresence, motion } from "framer-motion";

export function OnboardingForm({ step, onStepChange }: OnboardingFormProps) {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [error, setError] = useState<string | null>(null);
  const completeOnboardingMutation = useCompleteOnboarding();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      displayName: "",
      country: "",
      dateOfBirth: "",
      organization: "",
    },
    mode: "onChange",
  });

  const displayName = watch("displayName");
  const country = watch("country");
  const dateOfBirth = watch("dateOfBirth");
  const organization = watch("organization");

  useEffect(() => {
    if (session?.user?.name && !displayName) {
      setValue("displayName", session.user.name, { shouldValidate: true });
    }
  }, [session?.user?.name, displayName, setValue]);

  const dobDate = dateOfBirth ? new Date(dateOfBirth) : undefined;
  const reviewAge = dobDate ? ageFromDateOfBirth(dobDate) : null;

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
        setError(e instanceof Error ? e.message : "Could not save. Try again.");
      },
    });
  };

  const handleNext = () => {
    if (step < ONBOARDING_STEP_COUNT - 1) {
      onStepChange(step + 1);
    }
  };

  const stepValid = (() => {
    if (step === 0) return !errors.displayName && displayName.length >= 2;
    if (step === 1) return !errors.country && country.length === 2;
    if (step === 2) return !errors.dateOfBirth && dateOfBirth.length > 0;
    return true;
  })();

  const isKycStep = step === ONBOARDING_STEP_COUNT - 1;

  return (
    <div className="w-full max-w-sm space-y-6 text-left">
      <div className="relative min-h-[200px]">
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
                  Display name
                </Label>
                <Input
                  id="displayName"
                  {...register("displayName")}
                  placeholder="Your name"
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
                    Shown on your profile; you can change it anytime.
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
                  Country
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
                  Date of birth
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
                        <span>Pick a date</span>
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
                    Must be 18+. Use the same date as on your ID for
                    verification later.
                  </p>
                )}
              </div>
            ) : null}

            {step === 3 ? (
              <div className="space-y-1.5 sm:space-y-2">
                <Label
                  htmlFor="organization"
                  className="text-sm font-semibold text-black"
                >
                  Organization{" "}
                  <span className="font-normal text-black/50">(optional)</span>
                </Label>
                <Input
                  id="organization"
                  {...register("organization")}
                  placeholder="Company or group name"
                  autoComplete="organization"
                />
              </div>
            ) : null}

            {step === 4 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-black/5 bg-black/[0.01] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-black/30">
                      Name
                    </span>
                    <p className="mt-1 text-base font-semibold text-black">
                      {displayName || "—"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-black/5 bg-black/[0.01] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-black/30">
                      Country
                    </span>
                    <p className="mt-1 text-base font-semibold text-black">
                      {country || "—"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-black/5 bg-black/[0.01] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-black/30">
                      Age
                    </span>
                    <p className="mt-1 text-base font-semibold text-black">
                      {reviewAge !== null ? `${reviewAge} years` : "—"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-black/5 bg-black/[0.01] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-black/30">
                      Organization
                    </span>
                    <p className="mt-1 text-base font-semibold text-black">
                      {organization || "—"}
                    </p>
                  </div>
                </div>
                <p className="pt-4 text-center text-sm text-black/50">
                  Continue to identity verification, or finish without it.
                </p>
                <div className="flex justify-center">
                  <Button
                    type="button"
                    variant="link"
                    className="h-auto px-0 text-black/40 underline-offset-4 hover:text-black transition-colors"
                    disabled={completeOnboardingMutation.isPending}
                    onClick={handleSubmit((data) => onSubmit(data))}
                  >
                    Save profile and skip identity verification
                  </Button>
                </div>
              </div>
            ) : null}

            {step === 5 ? (
              <div className="space-y-6">
                <p className="text-center text-sm text-black/50">
                  KYC unlocks investing. Not ready?{" "}
                  <span className="font-semibold text-black">Skip for now</span>{" "}
                  below.
                </p>
                <div className="mx-auto max-w-sm rounded-3xl border border-black/5 bg-black/[0.01] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                  <p className="text-sm font-semibold text-black">
                    Before you start
                  </p>
                  <ul className="mt-3 space-y-3 text-sm text-black/60">
                    <li className="flex items-center gap-3">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />
                      Government-issued photo ID
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />
                      Selfie or liveness step
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

      <div className="space-y-8 border-t border-black/5 pt-8">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center justify-center gap-3">
            {Array.from({ length: ONBOARDING_STEP_COUNT }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => (i < step || stepValid ? onStepChange(i) : null)}
                disabled={i > step && !stepValid}
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

          <div className="flex w-full items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              className="rounded-full px-8 text-black/40 hover:bg-black/4 hover:text-black transition-colors"
              disabled={step === 0 || completeOnboardingMutation.isPending}
              onClick={() => onStepChange(Math.max(0, step - 1))}
            >
              Back
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
                  Skip for now
                </Button>
                <Button
                  type="button"
                  className="rounded-full bg-mint px-8 font-semibold text-mint-foreground shadow-[0_10px_20px_-5px_rgba(15,130,97,0.25)] hover:bg-mint/90 active:scale-95 transition-all"
                  disabled={completeOnboardingMutation.isPending}
                  onClick={handleSubmit((data) =>
                    onSubmit(data, { thenNavigate: "/kyc" }),
                  )}
                >
                  {completeOnboardingMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Save & verify identity"
                  )}
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                className="rounded-full bg-mint px-10 font-semibold text-mint-foreground shadow-[0_10px_20px_-5px_rgba(15,130,97,0.25)] hover:bg-mint/90 active:scale-95 transition-all"
                disabled={!stepValid || completeOnboardingMutation.isPending}
                onClick={handleNext}
              >
                Continue
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
