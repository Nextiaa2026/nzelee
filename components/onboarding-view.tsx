"use client";

import { useState } from "react";

import { OnboardingForm, ONBOARDING_STEP_COUNT } from "@/components/onboarding-form";
import {
  OnboardingWizardShell,
  type WizardStep,
} from "@/components/onboarding-wizard-shell";

const STEPS: WizardStep[] = [
  { label: "Display name" },
  { label: "Country" },
  { label: "Organization" },
  { label: "Review" },
  { label: "Identity (optional)" },
];

const TITLES = [
  "What should we call you?",
  "Where do you live?",
  "Organization (optional)",
  "Review your profile",
  "Verify your identity",
];

const SUBTITLES = [
  "This is how your name will appear across Nexiaa.",
  "We use this for compliance and to tailor your experience.",
  "Add a company or collective if it applies — you can leave this blank.",
  "Confirm your details before we save your profile.",
  "Regulators require identity checks before you invest. You can finish this now or skip and complete it later from your dashboard.",
];

export function OnboardingView() {
  const [step, setStep] = useState(0);
  const current = Math.min(step + 1, ONBOARDING_STEP_COUNT);

  return (
    <OnboardingWizardShell
      steps={STEPS}
      current={current}
      title={TITLES[step] ?? TITLES[TITLES.length - 1]!}
      subtitle={SUBTITLES[step] ?? SUBTITLES[SUBTITLES.length - 1]!}
      exitHref="/"
      exitLabel="Back to home"
    >
      <OnboardingForm step={step} onStepChange={setStep} />
    </OnboardingWizardShell>
  );
}
