"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

type ProjectWizardHorizontalStepperProps = {
  /** Step labels (e.g. General, Financial, …). */
  steps: readonly string[];
  /** Zero-based index of the active step. */
  currentIndex: number;
};

/**
 * Horizontal stepper (circles + connector line), aligned with onboarding/KYC “step of N” flows.
 */
export function ProjectWizardHorizontalStepper({
  steps,
  currentIndex,
}: ProjectWizardHorizontalStepperProps) {
  return (
    <nav aria-label="Project steps" className="mb-8 w-full max-w-2xl">
      <div className="relative px-2">
        <div
          className="pointer-events-none absolute left-[10%] right-[10%] top-5 border-t border-black/12 md:top-[1.35rem]"
          aria-hidden
        />
        <ol className="relative flex justify-between gap-1">
          {steps.map((label, i) => {
            const done = i < currentIndex;
            const current = i === currentIndex;
            return (
              <li key={label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                <span
                  className={cn(
                    "relative z-[1] grid size-9 shrink-0 place-items-center rounded-full border text-xs font-bold transition-colors sm:size-10 sm:text-sm",
                    current &&
                      "border-deep-green bg-deep-green text-white shadow-[0_1px_4px_rgba(0,0,0,0.12)]",
                    done &&
                      !current &&
                      "border-deep-green/40 bg-white text-deep-green shadow-[0_1px_3px_rgba(0,0,0,0.06)]",
                    !current && !done && "border-black/15 bg-white text-black/38",
                  )}
                >
                  {done ? <Check className="size-3.5 sm:size-4" strokeWidth={2.5} aria-hidden /> : i + 1}
                </span>
                <span
                  className={cn(
                    "max-w-[5.25rem] text-center text-[10px] font-semibold leading-snug sm:max-w-[6.5rem] sm:text-xs",
                    current && "font-semibold text-deep-green",
                    done && !current && "text-deep-green/80",
                    !current && !done && "font-normal text-black/45",
                  )}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
