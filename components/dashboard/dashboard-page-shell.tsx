import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Soft elevated panel — aligned with next-vote ice shadow, branded for Nzelee */
export const dashboardPanelClass =
  "rounded-3xl border-0 bg-white shadow-[0_10px_36px_-12px_rgba(5,45,29,0.12),0_2px_8px_rgba(5,45,29,0.06)]";

/**
 * One surface card: title + description + actions on the first row, then page body.
 * Matches the admin panel layout style.
 */
export function DashboardPageShell({
  eyebrow,
  title,
  description,
  actions,
  children,
  transparent = true,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
  transparent?: boolean;
}) {
  return (
    <div className={cn(!transparent && dashboardPanelClass)}>
      {/* Sticky Header Section */}
      <div
        className={cn(
          "flex flex-col gap-4 px-0 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:py-5",
          !transparent && "border-b border-deep-green/10 bg-white px-5 sm:px-6",
        )}
      >
        <div className="min-w-0 space-y-0.5">
          {eyebrow ? (
            <p className="text-[10px] font-bold uppercase tracking-widest text-mint-foreground/80">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="font-display text-xl font-bold tracking-tight text-deep-green md:text-2xl">
            {title}
          </h1>
          <p className="max-w-2xl text-[11px] leading-tight text-deep-green/60 md:text-sm">
            {description}
          </p>
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-stretch gap-2 sm:justify-end">
            {actions}
          </div>
        ) : null}
      </div>

      {/* Content Section */}
      <div className={cn("flex flex-col gap-6", !transparent && "px-5 pb-6 sm:px-6")}>
        {children}
      </div>
    </div>
  );
}
