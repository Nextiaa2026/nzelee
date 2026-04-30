import { cn } from "@/lib/utils";

/** Shared “checkout” field look for onboarding (text inputs + country select). */
export const onboardingFieldClassName = cn(
  "h-14 min-h-14 w-full rounded-xl border-2 border-black/10 bg-white px-4 text-base font-medium text-black shadow-sm outline-none transition-[border-color,box-shadow]",
  "placeholder:text-black/45",
  "focus-visible:border-black/20 focus-visible:ring-2 focus-visible:ring-mint/25 focus-visible:ring-offset-0",
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
);

/** Select trigger must match height + border; Radix trigger uses flex. */
export const onboardingSelectTriggerClassName = cn(
  onboardingFieldClassName,
  "flex items-center justify-between gap-2 py-0 font-medium",
  "hover:border-black/20 data-placeholder:text-black/45",
  "data-[size=default]:h-14 data-[size=sm]:h-14",
);
