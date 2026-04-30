import type { ReactNode } from "react";

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
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={dashboardPanelClass}>
      <div className="flex flex-col gap-4 border-b border-gray-200 p-6 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="min-w-0 space-y-1.5">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            {title}
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-gray-600">
            {description}
          </p>
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-stretch gap-2 sm:justify-end">
            {actions}
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-6 p-6">{children}</div>
    </div>
  );
}
