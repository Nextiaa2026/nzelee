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
      title: "Check your email",
      subtitle:
        "Enter the 6-digit code we sent you to finish creating your account.",
      side: "right",
      footer: (
        <>
          <Link
            href="/login"
            className="font-medium text-deep-green hover:underline hover:opacity-90"
          >
            Go to sign in
          </Link>
          {" · "}
          <Link
            href="/register"
            className="font-medium text-deep-green hover:underline hover:opacity-90"
          >
            Use a different email
          </Link>
        </>
      ),
    };
  }
  if (pathname.startsWith("/register")) {
    return {
      title: "Create your account",
      subtitle: `Join ${SITE_NAME} to explore offerings and manage your commitments in one place.`,
      side: "right",
      footer: (
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-deep-green hover:underline hover:opacity-90"
          >
            Sign in
          </Link>
        </>
      ),
    };
  }
  if (pathname.startsWith("/forgot-password")) {
    return {
      title: "Reset your password",
      subtitle:
        "We’ll email you a secure link to choose a new password if an account exists for that address.",
      side: "right",
      footer: (
        <>
          Remembered it?{" "}
          <Link
            href="/login"
            className="font-medium text-deep-green hover:underline hover:opacity-90"
          >
            Sign in
          </Link>
        </>
      ),
    };
  }
  if (pathname.startsWith("/reset-password")) {
    return {
      title: "Choose a new password",
      subtitle:
        "Use at least 8 characters and a combination you do not reuse on other sites.",
      side: "right",
      footer: (
        <>
          <Link
            href="/login"
            className="font-medium text-deep-green hover:underline hover:opacity-90"
          >
            Back to sign in
          </Link>
        </>
      ),
    };
  }
  if (pathname.startsWith("/verify-email")) {
    return {
      title: "Email verification",
      subtitle:
        "Enter the code from your inbox, or resend from sign-in with the same email.",
      side: "right",
      footer: (
        <>
          <Link
            href="/register/verification-sent"
            className="font-medium text-deep-green hover:underline hover:opacity-90"
          >
            Enter code
          </Link>
          {" · "}
          <Link
            href="/login"
            className="font-medium text-deep-green hover:underline hover:opacity-90"
          >
            Sign in
          </Link>
        </>
      ),
    };
  }
  return {
    title: "Welcome back",
    subtitle:
      "Continue with Google or your email and password to open your account.",
    side: "right",
    footer: (
      <>
        New here?{" "}
        <Link
          href="/register"
          className="font-medium text-deep-green hover:underline hover:opacity-90"
        >
          Create an account
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
          Back to site
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
