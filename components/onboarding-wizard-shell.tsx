import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type WizardStep = { label: string };

type OnboardingWizardShellProps = {
  steps: WizardStep[];
  /** 1-based index of the active step */
  current: number;
  /** Optional page heading; omit for label-only flows (headings live in the form). */
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  /** Centered single-column layout for focused flows like onboarding/KYC. */
  centered?: boolean;
  /** Tighter chrome when nested in another layout. */
  embedded?: boolean;
  className?: string;
};

/**
 * First-time profile setup — stepped header + sidebar (lg), inspired by
 * components/external/WizardShell.tsx, wired for Next.js.
 */
export function OnboardingWizardShell({
  steps,
  current,
  title,
  subtitle,
  children,
  centered = false,
  embedded = false,
  className,
}: OnboardingWizardShellProps) {
  const showHeading = Boolean(title?.trim());
  return (
    <div
      className={cn(
        "flex min-h-svh flex-col items-center justify-center bg-white p-4",
        className,
      )}
    >
      <div
        className={cn(
          "w-full mx-auto grid gap-10",
          centered
            ? "max-w-xl lg:grid-cols-1"
            : "max-w-6xl lg:grid-cols-[minmax(0,240px)_1fr]",
        )}
      >
        <aside className={cn("hidden lg:block", centered && "lg:hidden")}>
          <ol className="sticky top-24 space-y-2">
            {steps.map((s, i) => {
              const num = i + 1;
              const state =
                num < current ? "done" : num === current ? "active" : "todo";
              return (
                <li
                  key={s.label}
                  className={cn(
                    "flex items-start gap-3 rounded-2xl p-3 transition-colors",
                    state === "active" ? "border border-black/10 bg-white shadow-sm" : ""
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold transition-all duration-300",
                      state === "done"
                        ? "bg-primary text-primary-foreground"
                        : state === "active"
                          ? "bg-mint text-mint-foreground shadow-lg shadow-mint/20 ring-4 ring-mint/10"
                          : "border border-black/10 bg-white text-black/45"
                    )}
                  >
                    {state === "done" ? (
                      <Check className="size-4" strokeWidth={3} aria-hidden />
                    ) : (
                      num
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-widest",
                        state === "todo" ? "text-black/40" : "text-primary/70"
                      )}
                    >
                      Step {num}
                    </div>
                    <div
                      className={cn(
                        "truncate text-sm transition-colors",
                        state === "active"
                          ? "font-semibold text-black"
                          : "text-black/55"
                      )}
                    >
                      {s.label}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </aside>

        <main className={cn("relative w-full")}>
          <div className={cn("mb-8", !showHeading && !subtitle && "mb-4")}>
            <p
              className={cn(
                "mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-mint",
              )}
            >
              Step {current} of {steps.length}
            </p>
            {showHeading ? (
              <h1 className="mt-2 font-display text-xl font-bold tracking-tight text-black sm:text-2xl lg:text-3xl">
                {title}
              </h1>
            ) : null}
            {subtitle ? (
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-black/60">{subtitle}</p>
            ) : null}
          </div>
          <div className="relative">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
