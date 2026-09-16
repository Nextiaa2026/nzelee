"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

const labelMap: Record<string, string> = {
  admin: "Admin",
  dashboard: "Compte",
  campaigns: "Campagnes",
  users: "Utilisateurs",
  investments: "Investissements",
  transactions: "Transactions",
  withdrawals: "Retraits",
  notifications: "Notifications",
  settings: "Paramètres",
  projects: "Projets",
  saved: "Favoris",
  markets: "Marchés",
  kyc: "KYC",
  onboarding: "Onboarding",
  investors: "Investisseurs",
};

function toLabel(segment: string) {
  return (
    labelMap[segment] ??
    segment.replace(/-/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase())
  );
}

export function AppBreadcrumb({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const pathname = usePathname() ?? "/";
  const parts = pathname.split("/").filter(Boolean);
  const isDark = tone === "dark";

  const listClass = cn(
    "inline-flex rounded-full px-3.5 py-1.5 text-xs shadow-sm",
    isDark
      ? "border border-white/25 bg-black/35 text-white/90 backdrop-blur-sm"
      : "border border-black/15 bg-black/5 text-black/70",
  );
  const linkClass = isDark
    ? "text-white/85 hover:text-white"
    : "text-black/70 hover:text-black/90";
  const pageClass = isDark
    ? "font-medium text-white"
    : "font-medium text-black/90";
  const sepClass = isDark ? "text-white/50" : "text-black/45";

  if (parts.length === 0) {
    return (
      <Breadcrumb className={className}>
        <BreadcrumbList className={listClass}>
          <BreadcrumbItem>
            <BreadcrumbPage className={pageClass}>Accueil</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList className={listClass}>
        <BreadcrumbItem>
          <BreadcrumbLink asChild className={linkClass}>
            <Link href="/">Accueil</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {parts.map((segment, idx) => {
          const href = `/${parts.slice(0, idx + 1).join("/")}`;
          const isLast = idx === parts.length - 1;
          const label = toLabel(segment);
          return (
            <BreadcrumbItem key={href}>
              <BreadcrumbSeparator className={sepClass}>/</BreadcrumbSeparator>
              {isLast ? (
                <BreadcrumbPage className={pageClass}>{label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild className={linkClass}>
                  <Link href={href}>{label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
