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
  return labelMap[segment] ?? segment.replace(/-/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase());
}

export function AppBreadcrumb({ className }: { className?: string }) {
  const pathname = usePathname() ?? "/";
  const parts = pathname.split("/").filter(Boolean);

  if (parts.length === 0) {
    return (
      <Breadcrumb className={className}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Accueil</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList className="inline-flex rounded-full border border-black/15 bg-black/5 px-3.5 py-1.5 text-xs text-black/70">
        <BreadcrumbItem>
          <BreadcrumbLink asChild className="text-black/70 hover:text-black/90">
            <Link href="/">Accueil</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {parts.map((segment, idx) => {
          const href = `/${parts.slice(0, idx + 1).join("/")}`;
          const isLast = idx === parts.length - 1;
          const label = toLabel(segment);
          return (
            <BreadcrumbItem key={href}>
              <BreadcrumbSeparator className="text-black/45">/</BreadcrumbSeparator>
              {isLast ? (
                <BreadcrumbPage className="font-medium text-black/90">{label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild className="text-black/70 hover:text-black/90">
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
