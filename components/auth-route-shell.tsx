"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CompanyBrandMark } from "@/components/company-brand-mark";
import { SITE_NAME } from "@/lib/brand";

type AuthMeta = {
  title: string;
  subtitle?: string;
  footer?: React.ReactNode;
};

function metaForPath(pathname: string): AuthMeta {
  if (pathname.startsWith("/register/verification-sent")) {
    return {
      title: "Vérifiez vos emails",
      subtitle:
        "Saisissez le code à 6 chiffres que nous vous avons envoyé pour terminer la création de votre compte.",
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
      subtitle: `Rejoignez ${SITE_NAME} pour explorer les offres et gérer vos engagements en un seul endroit.`,
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
      subtitle:
        "Nous vous enverrons un lien sécurisé par email pour choisir un nouveau mot de passe si un compte existe pour cette adresse.",
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
      subtitle:
        "Utilisez au moins 8 caractères et une combinaison que vous n'utilisez pas sur d'autres sites.",
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
      subtitle:
        "Saisissez le code reçu dans votre boîte de réception, ou renvoyez-le depuis la connexion avec le même email.",
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
    subtitle:
      "Continuez avec Google ou votre email et mot de passe pour accéder à votre compte.",
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

export function AuthRouteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/login";
  const { title, subtitle, footer } = metaForPath(pathname);

  return (
    <div className="flex min-h-svh w-full flex-col bg-neutral-100 font-sans antialiased">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 flex items-center justify-between gap-4">
          <CompanyBrandMark variant="horizontalLightBg" href="/" priority />
          <Link
            href="/"
            className="text-sm font-medium text-black/55 transition hover:text-black/90"
          >
            Retour au site
          </Link>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <div className="rounded-2xl border border-deep-green/10 bg-white p-6 shadow-sm sm:p-8">
            <header className="mb-6 space-y-1.5 sm:mb-8 sm:space-y-2">
              <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {title}
              </h1>
              {subtitle ? (
                <p className="max-w-prose text-sm leading-relaxed text-black/60 sm:text-[15px]">
                  {subtitle}
                </p>
              ) : null}
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
