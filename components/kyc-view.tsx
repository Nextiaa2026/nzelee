"use client";

import { useState } from "react";

import { KycForm, KYC_STEP_COUNT } from "@/components/kyc-form";
import {
  OnboardingWizardShell,
  type WizardStep,
} from "@/components/onboarding-wizard-shell";

const STEPS: WizardStep[] = [
  { label: "Document Type" },
  { label: "ID Number" },
  { label: "Front side" },
  { label: "Back side" },
  { label: "Selfie" },
  { label: "Review" },
];

const TITLES = [
  "Select your ID",
  "Enter ID number",
  "Front of your ID",
  "Back of your ID",
  "Identity check",
  "Ready to submit",
];

const SUBTITLES = [
  "Choose the government-issued document you will use for identity verification.",
  "Enter the unique identification number as it appears on your chosen document.",
  "Take a clear photo of the front side of your document. Ensure all text is readable.",
  "Flip your document over and take a photo of the back side. (Optional for Passports)",
  "Finally, take a clear selfie of your face to match it with your identification.",
  "Please review all information and documents before submitting for official review.",
];

export function KycView() {
  const [step, setStep] = useState(0);
  const current = Math.min(step + 1, KYC_STEP_COUNT);

  return (
    <OnboardingWizardShell
      embedded
      centered
      steps={STEPS}
      current={current}
      title={TITLES[step] ?? TITLES[TITLES.length - 1]!}
      subtitle={SUBTITLES[step] ?? SUBTITLES[SUBTITLES.length - 1]!}
    >
      <KycForm step={step} onStepChange={setStep} />
    </OnboardingWizardShell>
  );
}
