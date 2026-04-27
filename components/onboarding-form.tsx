"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";

import { completeOnboarding } from "@/app/onboarding/actions";
import { CountrySelect } from "@/components/country-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const ONBOARDING_STEP_COUNT = 5;

type OnboardingFormProps = {
  step: number;
  onStepChange: (step: number) => void;
};

export function OnboardingForm({ step, onStepChange }: OnboardingFormProps) {
  const router = useRouter();
  const { update } = useSession();
  const [displayName, setDisplayName] = useState("");
  const [country, setCountry] = useState("");
  const [organization, setOrganization] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function finish(options?: { thenNavigate?: "/dashboard/kyc" }) {
    setError(null);
    setPending(true);
    try {
      await completeOnboarding({
        displayName: displayName.trim(),
        country,
        organization: organization.trim() || undefined,
      });
      await update();
      if (options?.thenNavigate) {
        router.push(options.thenNavigate);
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save. Try again.");
    } finally {
      setPending(false);
    }
  }

  const canGoNext =
    (step === 0 && displayName.trim().length >= 2) ||
    (step === 1 && country.length === 2) ||
    step === 2 ||
    step === 3;

  const isKycStep = step === ONBOARDING_STEP_COUNT - 1;

  return (
    <Card
      className={cn(
        "w-full gap-0 border-0 bg-transparent py-0 shadow-none ring-0",
      )}
    >
      <CardContent className="space-y-6 p-0 text-left">
        <span className="sr-only">
          {step === 0 && "Display name"}
          {step === 1 && "Country"}
          {step === 2 && "Organization"}
          {step === 3 && "Confirm and continue"}
          {step === 4 && "Optional identity verification"}
        </span>

        <div className="space-y-4">
          {step === 0 ? (
            <div className="space-y-2">
              <Label htmlFor="displayName">Display name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Jane Doe"
                autoComplete="name"
              />
            </div>
          ) : null}
          {step === 1 ? (
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <CountrySelect
                id="country"
                value={country}
                onValueChange={setCountry}
                disabled={pending}
              />
            </div>
          ) : null}
          {step === 2 ? (
            <div className="space-y-2">
              <Label htmlFor="organization">Organization (optional)</Label>
              <Input
                id="organization"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Acme Collective"
                autoComplete="organization"
              />
            </div>
          ) : null}
          {step === 3 ? (
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Name:</span>{" "}
                {displayName.trim() || "—"}
              </p>
              <p>
                <span className="font-medium text-foreground">Country:</span>{" "}
                {country || "—"}
              </p>
              <p>
                <span className="font-medium text-foreground">Organization:</span>{" "}
                {organization.trim() || "—"}
              </p>
              <p className="pt-1">
                Continue to optional identity verification, or finish now without
                it.
              </p>
              <Button
                type="button"
                variant="link"
                className="h-auto px-0 text-muted-foreground underline-offset-4 hover:text-foreground"
                disabled={pending}
                onClick={() => void finish()}
              >
                Save profile and skip identity verification
              </Button>
            </div>
          ) : null}
          {step === 4 ? (
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                Completing KYC unlocks investing and higher limits. If you are
                not ready, choose{" "}
                <span className="font-medium text-foreground">Skip for now</span>{" "}
                — you can open{" "}
                <span className="font-medium text-foreground">
                  Identity verification
                </span>{" "}
                anytime from your dashboard.
              </p>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-medium text-foreground">You will need</p>
                <ul className="mt-2 list-inside list-disc space-y-1">
                  <li>One government-issued photo ID</li>
                  <li>A short selfie or liveness step when the flow is live</li>
                </ul>
              </div>
            </div>
          ) : null}
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>

        {isKycStep ? (
          <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              className="sm:mr-auto"
              disabled={pending}
              onClick={() => void finish()}
            >
              Skip for now
            </Button>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={pending}
                onClick={() => onStepChange(3)}
              >
                Back
              </Button>
              <Button
                type="button"
                disabled={pending}
                onClick={() => void finish({ thenNavigate: "/dashboard/kyc" })}
              >
                {pending ? "Saving…" : "Save & verify identity"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3 border-t border-border pt-6">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-10 shrink-0"
              disabled={step === 0 || pending}
              onClick={() => onStepChange(Math.max(0, step - 1))}
              aria-label="Previous step"
            >
              <ChevronLeft className="size-5" aria-hidden />
            </Button>
            <p className="min-w-0 flex-1 text-left text-sm tabular-nums text-muted-foreground">
              Step {step + 1} of {ONBOARDING_STEP_COUNT}
            </p>
            {step === 3 ? (
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-10 shrink-0"
                disabled={!canGoNext || pending}
                onClick={() => onStepChange(4)}
                aria-label="Next step"
              >
                <ChevronRight className="size-5" aria-hidden />
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-10 shrink-0"
                disabled={!canGoNext || pending}
                onClick={() =>
                  onStepChange(
                    Math.min(ONBOARDING_STEP_COUNT - 1, step + 1),
                  )
                }
                aria-label="Next step"
              >
                <ChevronRight className="size-5" aria-hidden />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
