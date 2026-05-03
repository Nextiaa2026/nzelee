import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type KycDeferredShellProps = {
  children: React.ReactNode;
};

/**
 * Optional compact chrome for KYC (unused when `/kyc` uses `app/kyc/layout.tsx`).
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
          Retour au tableau de bord
        </Link>
        <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Compléter la vérification d&apos;identité
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Vous avez passé cette étape lors de l&apos;onboarding. Terminez votre KYC ici quand vous serez prêt
          à investir — mêmes exigences, sans la mise en page de l&apos;assistant de profil complet.
        </p>
      </div>

      <div className="mx-auto w-full max-w-xl flex-1 pb-10">{children}</div>
    </div>
  );
}
