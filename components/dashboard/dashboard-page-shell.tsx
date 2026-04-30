import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Flat panel used across dashboard content - matches admin panel style */
export const dashboardPanelClass =
  "rounded-xl border border-gray-200 bg-white shadow-sm";

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
      <div className={cn(
        "sticky top-[57px] z-30 flex flex-col gap-4 px-5 py-5 sm:static sm:z-auto sm:px-6 sm:flex-row sm:items-start sm:justify-between sm:gap-6",
        transparent ? "border-b border-foreground/5 bg-white/80 backdrop-blur-md md:border-none md:bg-transparent md:backdrop-blur-none" : "border-b border-gray-200 bg-white"
      )}>
        <div className="min-w-0 space-y-0.5">
          {eyebrow ? (
            <p className="text-[10px] font-bold uppercase tracking-widest text-deep-green/60">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="font-display text-xl font-bold tracking-tight text-gray-900 md:text-2xl">
            {title}
          </h1>
          <p className="max-w-2xl text-[11px] leading-tight text-gray-500 md:text-sm">
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
      <div className={cn("flex flex-col gap-6 p-5 sm:p-6", transparent && "pt-4")}>
        {children}
      </div>
    </div>
  );
}
