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
  dashboard: "Account",
  campaigns: "Campaigns",
  users: "Users",
  investments: "Investments",
  transactions: "Transactions",
  withdrawals: "Withdrawals",
  notifications: "Notifications",
  settings: "Settings",
  projects: "Projects",
  saved: "Saved",
  markets: "Markets",
  kyc: "KYC",
  onboarding: "Onboarding",
  investors: "Investors",
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
            <BreadcrumbPage>Home</BreadcrumbPage>
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
            <Link href="/">Home</Link>
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
