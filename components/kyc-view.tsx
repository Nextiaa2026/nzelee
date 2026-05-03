"use client";

import { useState } from "react";

import { KycForm, KYC_STEP_COUNT } from "@/components/kyc-form";
import {
  OnboardingWizardShell,
  type WizardStep,
} from "@/components/onboarding-wizard-shell";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const STEPS: WizardStep[] = [
  { label: "Type de document" },
  { label: "Numéro d'ID" },
  { label: "Recto" },
  { label: "Verso" },
  { label: "Selfie" },
  { label: "Révision" },
];

const TITLES = [
  "Sélectionnez votre ID",
  "Entrez le numéro d'ID",
  "Recto de votre ID",
  "Verso de votre ID",
  "Contrôle d'identité",
  "Prêt à soumettre",
];

const SUBTITLES = [
  "Choisissez le document officiel que vous utiliserez pour la vérification d'identité.",
  "Entrez le numéro d'identification unique tel qu'il apparaît sur le document choisi.",
  "Prenez une photo claire du recto de votre document. Assurez-vous que tout le texte est lisible.",
  "Retournez votre document et prenez une photo du verso. (Optionnel pour les passeports)",
  "Enfin, prenez un selfie clair de votre visage pour le faire correspondre à votre identification.",
  "Veuillez vérifier toutes les informations et documents avant de les soumettre pour examen officiel.",
];

export function KycView() {
  const router = useRouter();
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
      topRightAction={
        <Button
          type="button"
          variant="ghost"
          className="h-auto p-0 text-[11px] font-bold uppercase tracking-widest text-black/40 underline-offset-4 hover:bg-transparent hover:text-black hover:underline transition-colors"
          onClick={() => router.push("/dashboard")}
        >
          Ignorer pour l&apos;instant
        </Button>
      }
    >
      <KycForm step={step} onStepChange={setStep} />
    </OnboardingWizardShell>
  );
}
