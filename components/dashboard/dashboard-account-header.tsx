"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  X,
} from "lucide-react";

import { DashboardWalletHeaderPill } from "@/components/dashboard/dashboard-wallet-header-pill";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUnreadNotificationCount } from "@/hooks/use-notifications";
import {
  dashboardAdminConsoleItem,
  getDashboardNavItems,
} from "@/lib/dashboard/dashboard-nav-config";
import { SITE_NAME } from "@/lib/brand";
import { cn } from "@/lib/utils";

function SheetNavLink({
  href,
  label,
  icon: Icon,
  exact,
  badge,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  badge?: number;
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);
  return (
    <SheetClose asChild>
      <Link
        href={href}
        onClick={onNavigate}
        className={cn(
          "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-primary-foreground transition-colors",
          active
            ? "bg-primary-foreground/15 ring-1 ring-primary-foreground/25"
            : "hover:bg-primary-foreground/10",
        )}
      >
        <Icon className="size-4 shrink-0 opacity-90" />
        <span className="flex-1">{label}</span>
        {badge != null && badge > 0 ? (
          <span className="rounded-full bg-primary-foreground px-1.5 py-0.5 text-[10px] font-semibold text-primary tabular-nums">
            {badge > 99 ? "99+" : badge}
          </span>
        ) : null}
      </Link>
    </SheetClose>
  );
}

export function DashboardAccountHeader({
  user,
  isAdmin,
  kycStatus,
}: {
  user: { name: string; email: string; avatar?: string };
  isAdmin: boolean;
  kycStatus?: string | null;
}) {
  const pathname = usePathname();
  const { data: unread = 0 } = useUnreadNotificationCount();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuItems = getDashboardNavItems(isAdmin);
  const currentSectionLabel =
    menuItems.find((item) =>
      item.exact ? pathname === item.href : pathname.startsWith(item.href),
    )?.label ?? "Menu";

  const getKycStatusDisplay = (status: string | null | undefined) => {
    switch (status) {
      case "APPROVED":
        return {
          label: "Verified",
          color: "bg-green-100 text-green-700 border-green-200",
        };
      case "UNDER_REVIEW":
        return {
          label: "Under Review",
          color: "bg-yellow-100 text-yellow-700 border-yellow-200",
        };
      case "REJECTED":
        return {
          label: "Rejected",
          color: "bg-red-100 text-red-700 border-red-200",
        };
      case "EXPIRED":
        return {
          label: "Expired",
          color: "bg-gray-100 text-gray-700 border-gray-200",
        };
      default:
        return {
          label: "Pending",
          color: "bg-gray-100 text-gray-700 border-gray-200",
        };
    }
  };

  const kycDisplay = getKycStatusDisplay(kycStatus);

  return (
    <header className="sticky top-0 z-40 border-b border-foreground/8 bg-white shadow-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-2.5 md:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="shrink-0 rounded-full border-foreground/15 lg:hidden"
              aria-label="Open dashboard menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="size-4" />
            </Button>
            <SheetContent
              side="left"
              showCloseButton={false}
              className="flex w-[min(100%,20rem)] flex-col border-r border-primary-foreground/15 bg-primary p-0 text-primary-foreground shadow-md"
            >
              <div className="flex items-center justify-between border-b border-primary-foreground/15 px-4 py-4 pr-14">
                <div>
                  <SheetTitle className="text-base font-semibold text-primary-foreground">
                    {currentSectionLabel}
                  </SheetTitle>
                  <SheetDescription className="text-xs text-primary-foreground/70">
                    {user.name}
                  </SheetDescription>
                </div>
                <SheetClose asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="absolute top-3 right-3 text-primary-foreground hover:bg-primary-foreground/10"
                    aria-label="Close menu"
                  >
                    <X className="size-5" />
                  </Button>
                </SheetClose>
              </div>
              <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3 pb-6">
                <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground/60">
                  Menu
                </p>
                {menuItems.map((item) => (
                  <SheetNavLink
                    key={item.href}
                    {...item}
                    onNavigate={() => setMenuOpen(false)}
                  />
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Link
            href="/dashboard"
            className="font-display text-base font-bold tracking-tight text-foreground sm:text-lg"
          >
            {SITE_NAME}
          </Link>
          <DashboardWalletHeaderPill />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {kycStatus && (
            <Link href="/kyc">
              <div
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors hover:opacity-80",
                  kycDisplay.color,
                )}
              >
                <ShieldCheck className="size-3.5" />
                <span className="hidden sm:inline">{kycDisplay.label}</span>
              </div>
            </Link>
          )}
          <Link href="/dashboard/notifications">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="relative h-9 w-9 rounded-full border-foreground/15"
              aria-label="Notifications"
            >
              <Bell className="size-4" />
              {unread > 0 ? (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                  {unread > 9 ? "9+" : unread}
                </span>
              ) : null}
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 gap-2 rounded-full border-foreground/15 px-2 sm:px-2.5"
                aria-label="Profile menu"
              >
                <Avatar className="h-7 w-7 rounded-full border border-foreground/10">
                  <AvatarImage src={user.avatar} alt="" />
                  <AvatarFallback className="bg-foreground/5 text-[10px] font-bold text-foreground/50">
                    {user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="size-3.5 opacity-60" aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <span className="block truncate font-medium text-foreground">
                  {user.name}
                </span>
                <span className="block truncate text-xs font-normal text-muted-foreground">
                  {user.email}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/settings"
                  className="flex cursor-pointer items-center gap-2"
                >
                  <Settings className="size-4 opacity-70" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                onClick={() => void signOut({ callbackUrl: "/" })}
              >
                <LogOut className="size-4 opacity-70" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
