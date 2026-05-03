"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthHeroPanel } from "@/components/auth-hero-panel";
import { CompanyBrandMark } from "@/components/company-brand-mark";
import { SITE_NAME } from "@/lib/brand";

type AuthMeta = {
  title: string;
  subtitle?: string;
  /** Form column on the left on large screens */
  side?: "left" | "right";
  footer?: React.ReactNode;
};

function metaForPath(pathname: string): AuthMeta {
  if (pathname.startsWith("/register/verification-sent")) {
    return {
      title: "Vérifiez vos emails",
      subtitle:
        "Saisissez le code à 6 chiffres que nous vous avons envoyé pour terminer la création de votre compte.",
      side: "right",
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
      side: "right",
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
      side: "right",
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
      side: "right",
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
      side: "right",
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
    side: "right",
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
  const { title, subtitle, side = "right", footer } = metaForPath(pathname);

  const formPanel = (
    <div className="flex min-h-svh w-full flex-col bg-white px-6 py-10 sm:px-10 lg:w-[46%] lg:border-r lg:border-border lg:px-12 xl:px-16 dark:bg-card">
      <div className="mb-10 flex items-center justify-between gap-4">
        <CompanyBrandMark variant="horizontalLightBg" href="/" priority />
        <Link
          href="/"
          className="text-sm text-black/55 transition hover:text-black/90 dark:text-white/55 dark:hover:text-white/90"
        >
          Retour au site
        </Link>
      </div>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <header className="mb-6 space-y-1.5 sm:mb-8 sm:space-y-2">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="max-w-prose text-sm leading-relaxed text-black/60 sm:text-[15px] dark:text-white/65">
              {subtitle}
            </p>
          ) : null}
        </header>
        {children}
        {footer ? (
          <p className="mt-8 text-sm text-black/55 dark:text-white/60">
            {footer}
          </p>
        ) : null}
      </div>
    </div>
  );

  const hero = <AuthHeroPanel />;

  return (
    <div className="hero-glow relative flex min-h-svh w-full flex-col overflow-hidden bg-hero-bg lg:flex-row">
      {side === "left" ? (
        <>
          {hero}
          {formPanel}
        </>
      ) : (
        <>
          {formPanel}
          {hero}
        </>
      )}
    </div>
  );
}
