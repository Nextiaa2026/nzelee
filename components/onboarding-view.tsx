"use client";

import { useState } from "react";

import {
  OnboardingForm,
  ONBOARDING_STEP_COUNT,
} from "@/components/onboarding-form";
import {
  OnboardingWizardShell,
  type WizardStep,
} from "@/components/onboarding-wizard-shell";

const STEPS: WizardStep[] = [
  { label: "Display name" },
  { label: "Country" },
  { label: "Date of birth" },
  { label: "Organization" },
  { label: "Review" },
  { label: "Identity (optional)" },
];

export function OnboardingView() {
  const [step, setStep] = useState(0);
  const current = Math.min(step + 1, ONBOARDING_STEP_COUNT);

  return (
    <OnboardingWizardShell embedded centered steps={STEPS} current={current}>
      <OnboardingForm step={step} onStepChange={setStep} />
    </OnboardingWizardShell>
  );
}
