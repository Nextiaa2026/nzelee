"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { GalleryVerticalEndIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Overview", match: (p: string) => p === "/dashboard" },
  { href: "/dashboard/transactions", label: "Transactions", match: (p: string) => p.startsWith("/dashboard/transactions") },
  { href: "/dashboard/investments", label: "Investments", match: (p: string) => p.startsWith("/dashboard/investments") },
  { href: "/dashboard/withdrawals", label: "Withdrawals", match: (p: string) => p.startsWith("/dashboard/withdrawals") },
  { href: "/dashboard/settings", label: "Settings", match: (p: string) => p.startsWith("/dashboard/settings") },
  { href: "/dashboard/kyc", label: "Verification", match: (p: string) => p.startsWith("/dashboard/kyc") },
];

export function DashboardNav({
  user,
  isAdmin,
}: {
  user: { name: string; email: string };
  isAdmin: boolean;
}) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-medium text-emerald-900 dark:text-emerald-100"
          >
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEndIcon className="size-4" />
            </span>
            <span className="hidden sm:inline">Nexiaa</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-1">
            {links.map((item) => (
              <Button
                key={item.href}
                variant={item.match(pathname) ? "secondary" : "ghost"}
                size="sm"
                className={cn("h-8", item.match(pathname) && "bg-secondary")}
                asChild
              >
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin">Admin</Link>
            </Button>
          ) : null}
          <div className="hidden text-right text-xs leading-tight sm:block">
            <p className="font-medium text-foreground">{user.name}</p>
            <p className="truncate text-muted-foreground">{user.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => void signOut({ callbackUrl: "/" })}>
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
