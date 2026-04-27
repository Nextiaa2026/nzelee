import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type KycDeferredShellProps = {
  children: React.ReactNode;
};

/**
 * Identity verification when the user returns from the dashboard — compact
 * header and single column (no step sidebar), unlike onboarding wizard.
 */
export function KycDeferredShell({ children }: KycDeferredShellProps) {
  return (
    <div className="flex min-h-[calc(100svh-4rem)] flex-col">
      <div className="mb-8 rounded-2xl border border-border bg-muted/30 px-4 py-4 sm:px-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-4 opacity-80" aria-hidden />
          Back to dashboard
        </Link>
        <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Complete identity verification
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          You skipped this during onboarding. Finish KYC here when you are ready
          to invest — same requirements, without the full profile wizard layout.
        </p>
      </div>

      <div className="mx-auto w-full max-w-xl flex-1 pb-10">{children}</div>
    </div>
  );
}
