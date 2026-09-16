"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { CompanyBrandMark } from "@/components/company-brand-mark";
import { SITE_NAME } from "@/lib/brand";

type AuthMeta = {
  title: string;
  footer?: React.ReactNode;
};

const authCardClass =
  "rounded-2xl border border-deep-green/10 bg-white p-7 shadow-[0_8px_30px_-12px_rgba(5,45,29,0.14),0_2px_8px_-4px_rgba(5,45,29,0.06)] sm:p-9 md:p-10";

function metaForPath(pathname: string): AuthMeta {
  if (pathname.startsWith("/register/verification-sent")) {
    return {
      title: "Vérifiez vos emails",
      footer: (
        <>
          <Link
            href="/login"
            className="font-medium text-deep-green hover:underline hover:opacity-90"
          >
            Aller à la connexion
          </Link>
          {" · "}
          <Link
            href="/register"
            className="font-medium text-deep-green hover:underline hover:opacity-90"
          >
            Utiliser un autre email
          </Link>
        </>
      ),
    };
  }
  if (pathname.startsWith("/register")) {
    return {
      title: "Créez votre compte",
      footer: (
        <>
          Vous avez déjà un compte ?{" "}
          <Link
            href="/login"
            className="font-medium text-deep-green hover:underline hover:opacity-90"
          >
            Se connecter
          </Link>
        </>
      ),
    };
  }
  if (pathname.startsWith("/forgot-password")) {
    return {
      title: "Réinitialisez votre mot de passe",
      footer: (
        <>
          Vous vous en souvenez ?{" "}
          <Link
            href="/login"
            className="font-medium text-deep-green hover:underline hover:opacity-90"
          >
            Se connecter
          </Link>
        </>
      ),
    };
  }
  if (pathname.startsWith("/reset-password")) {
    return {
      title: "Choisissez un nouveau mot de passe",
      footer: (
        <>
          <Link
            href="/login"
            className="font-medium text-deep-green hover:underline hover:opacity-90"
          >
            Retour à la connexion
          </Link>
        </>
      ),
    };
  }
  if (pathname.startsWith("/verify-email")) {
    return {
      title: "Vérification de l'email",
      footer: (
        <>
          <Link
            href="/register/verification-sent"
            className="font-medium text-deep-green hover:underline hover:opacity-90"
          >
            Saisir le code
          </Link>
          {" · "}
          <Link
            href="/login"
            className="font-medium text-deep-green hover:underline hover:opacity-90"
          >
            Se connecter
          </Link>
        </>
      ),
    };
  }
  return {
    title: "Bon retour parmi nous",
    footer: (
      <>
        Nouveau ici ?{" "}
        <Link
          href="/register"
          className="font-medium text-deep-green hover:underline hover:opacity-90"
        >
          Créer un compte
        </Link>
      </>
    ),
  };
}

function AuthAside() {
  return (
    <aside className="relative hidden border-r border-deep-green/10 bg-white lg:flex lg:flex-col lg:justify-between lg:p-10 xl:p-12">
      <CompanyBrandMark variant="horizontalLightBg" href="/" priority />

      <div className="max-w-sm space-y-4">
        <p className="font-sans text-3xl font-light leading-tight tracking-tight text-deep-green xl:text-4xl">
          Investissez dans des projets vérifiés
        </p>
        <p className="text-sm font-light leading-relaxed text-deep-green/65">
          {SITE_NAME} regroupe des campagnes sélectionnées, un suivi clair et un
          parcours sécurisé — du premier engagement au retrait.
        </p>
      </div>

      <p className="text-xs font-light uppercase tracking-widest text-deep-green/45">
        Plateforme d&apos;investissement
      </p>
    </aside>
  );
}

export function AuthRouteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/login";
  const { title, footer } = metaForPath(pathname);

  return (
    <div className="grid min-h-svh w-full bg-neutral-100 font-sans antialiased lg:grid-cols-[minmax(280px,0.85fr)_minmax(0,1.15fr)]">
      <AuthAside />

      <div className="flex min-h-svh flex-col px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
        <div className="mb-8 flex items-center justify-between gap-4 lg:mb-10">
          <div className="lg:hidden">
            <CompanyBrandMark variant="horizontalLightBg" href="/" priority />
          </div>
          <div className="hidden lg:block" />
          <Link
            href="/"
            className="ml-auto text-sm font-medium text-black/55 transition hover:text-black/90"
          >
            Retour au site
          </Link>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <div className={`mx-auto w-full max-w-lg ${authCardClass}`}>
            <header className="mb-7 sm:mb-8">
              <h1 className="font-sans text-3xl font-light tracking-tight text-foreground sm:text-4xl">
                {title}
              </h1>
            </header>
            {children}
            {footer ? (
              <p className="mt-8 text-center text-sm text-black/55">{footer}</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
