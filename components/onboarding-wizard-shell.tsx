import Link from "next/link";
import { GalleryVerticalEndIcon } from "lucide-react";

export type WizardStep = { label: string };

type OnboardingWizardShellProps = {
  steps: WizardStep[];
  /** 1-based index of the active step */
  current: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  exitHref?: string;
  exitLabel?: string;
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
  exitHref = "/",
  exitLabel = "Save & exit",
}: OnboardingWizardShellProps) {
  const progress = (current / steps.length) * 100;

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b border-border bg-card/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-medium text-foreground"
          >
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GalleryVerticalEndIcon className="size-5" aria-hidden />
            </span>
            <span className="font-display text-sm sm:text-base">Nexiaa</span>
          </Link>
          <Link
            href={exitHref}
            className="text-sm text-muted-foreground transition hover:text-foreground"
          >
            {exitLabel}
          </Link>
        </div>
        <div className="h-1 w-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,240px)_1fr] lg:py-12">
        <aside className="hidden lg:block">
          <ol className="space-y-1">
            {steps.map((s, i) => {
              const num = i + 1;
              const state =
                num < current ? "done" : num === current ? "active" : "todo";
              return (
                <li key={s.label} className="flex items-start gap-3 rounded-lg p-3">
                  <span
                    className={
                      "mt-0.5 grid h-7 w-7 place-items-center rounded-full text-xs font-semibold " +
                      (state === "done"
                        ? "bg-primary text-primary-foreground"
                        : state === "active"
                          ? "bg-mint text-mint-foreground ring-4 ring-mint/30"
                          : "border border-border bg-card text-muted-foreground")
                    }
                  >
                    {state === "done" ? "✓" : num}
                  </span>
                  <div>
                    <div
                      className={
                        "text-xs font-medium uppercase tracking-wider " +
                        (state === "todo"
                          ? "text-muted-foreground"
                          : "text-foreground")
                      }
                    >
                      Step {num}
                    </div>
                    <div
                      className={
                        "text-sm " +
                        (state === "active"
                          ? "font-semibold text-foreground"
                          : "text-muted-foreground")
                      }
                    >
                      {s.label}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </aside>

        <main>
          <div className="mb-8">
            <p className="text-sm font-medium uppercase tracking-wider text-primary">
              Step {current} of {steps.length}
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-3 max-w-2xl text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
