"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { BellIcon, MenuIcon, MoreHorizontal } from "lucide-react";
import {
  Logout01Icon,
  Notification01Icon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";

import { CompanyBrandMark } from "@/components/company-brand-mark";
import { DashboardWalletHeaderPill } from "@/components/dashboard/dashboard-wallet-header-pill";
import { Hugeicon } from "@/components/hugeicon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useMyNotifications } from "@/hooks/use-notifications";
import {
  dashboardAdminConsoleItem,
  dashboardSettingsItem,
  getDashboardNavItems,
  type DashboardNavItem,
} from "@/lib/dashboard/dashboard-nav-config";
import { cn } from "@/lib/utils";

type InvestorTopNavProps = {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  isAdmin?: boolean;
};

function isNavActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function InvestorTopNav({
  user,
  isAdmin = false,
}: InvestorTopNavProps) {
  const pathname = usePathname() ?? "/dashboard";
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: notifications } = useMyNotifications();

  const primaryItems = getDashboardNavItems();
  const secondaryItems: DashboardNavItem[] = [
    dashboardSettingsItem,
    ...(isAdmin
      ? [
          {
            href: dashboardAdminConsoleItem.href,
            label: dashboardAdminConsoleItem.label,
            icon: dashboardAdminConsoleItem.icon,
          } satisfies DashboardNavItem,
        ]
      : []),
  ];
  const allItems = [...primaryItems, ...secondaryItems];

  // Show first few links inline; rest in "More" on medium screens
  const inlineCount = 5;
  const inlineItems = primaryItems.slice(0, inlineCount);
  const moreItems = [...primaryItems.slice(inlineCount), ...secondaryItems];

  const unreadCount = notifications?.filter((n) => !n.readAt).length ?? 0;
  const recentNotifications = notifications?.slice(0, 5) ?? [];
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-20 border-b border-deep-green/10 bg-white/95 backdrop-blur-md">
      <div className="flex h-14 items-center gap-2 px-4 lg:h-16 lg:gap-3 lg:px-6">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 text-deep-green hover:bg-mint/15 lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Ouvrir le menu"
        >
          <MenuIcon className="size-5" />
        </Button>

        <CompanyBrandMark
          variant="horizontalLightBg"
          href="/dashboard"
          className="shrink-0"
        />

        <nav className="ml-2 hidden min-w-0 flex-1 items-center gap-0.5 lg:flex">
          {inlineItems.map((item) => {
            const active = isNavActive(pathname, item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-mint/25 text-deep-green"
                    : "text-deep-green/70 hover:bg-mint/10 hover:text-deep-green"
                )}
              >
                {item.label}
              </Link>
            );
          })}

          {moreItems.length > 0 ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-deep-green/70 hover:bg-mint/10 hover:text-deep-green"
                >
                  Plus
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-48">
                {moreItems.map((item) => {
                  const active = isNavActive(pathname, item.href, item.exact);
                  return (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "gap-2",
                          active && "bg-mint/20 font-medium text-deep-green"
                        )}
                      >
                        <item.icon className="size-4 shrink-0" strokeWidth={2} />
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <DashboardWalletHeaderPill />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 rounded-md text-deep-green hover:bg-mint/15 hover:text-deep-green"
              >
                <BellIcon className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full border-0 bg-mint px-1 text-xs text-deep-green">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 border border-deep-green/10 bg-white p-1.5 text-deep-green shadow-sm"
            >
              <DropdownMenuLabel className="flex items-center justify-between text-deep-green">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <Badge className="rounded-md border-0 bg-deep-green/10 text-deep-green">
                    {unreadCount} nouvelles
                  </Badge>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-deep-green/10" />
              {recentNotifications.length > 0 ? (
                <>
                  {recentNotifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="flex cursor-pointer flex-col items-start gap-1 rounded-lg p-3 focus:bg-mint/15 focus:text-deep-green data-highlighted:bg-mint/15"
                    >
                      <div className="flex w-full items-start justify-between gap-2">
                        <span className="line-clamp-1 text-sm font-medium">
                          {notification.title}
                        </span>
                        {!notification.readAt && (
                          <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-deep-green" />
                        )}
                      </div>
                      {notification.body && (
                        <span className="line-clamp-2 text-xs text-deep-green/70">
                          {notification.body}
                        </span>
                      )}
                      <span className="text-xs text-deep-green/55">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator className="bg-deep-green/10" />
                  <DropdownMenuItem asChild className="rounded-lg">
                    <Link
                      href="/dashboard/notifications"
                      className="w-full text-center text-sm font-medium"
                    >
                      Voir toutes les notifications
                    </Link>
                  </DropdownMenuItem>
                </>
              ) : (
                <div className="p-4 text-center text-sm text-deep-green/60">
                  Aucune notification
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-9 gap-2 rounded-md px-1.5 text-deep-green hover:bg-mint/15"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg bg-mint text-deep-green">
                    {initials || "MD"}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden max-w-28 truncate text-sm font-medium md:inline">
                  {user.name}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-56 rounded-lg">
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg">{initials || "MD"}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="gap-2">
                <Link href="/dashboard/settings">
                  <Hugeicon icon={UserCircleIcon} size={18} className="opacity-70" />
                  Paramètres
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="gap-2">
                <Link href="/dashboard/notifications">
                  <Hugeicon
                    icon={Notification01Icon}
                    size={18}
                    className="opacity-70"
                  />
                  Notifications
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                <Hugeicon icon={Logout01Icon} size={18} className="opacity-70" />
                Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[min(100%,20rem)] bg-white p-0">
          <SheetHeader className="border-b border-deep-green/10 px-4 py-4 text-left">
            <SheetTitle className="font-display text-deep-green">
              Mon compte
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-0.5 p-3">
            {allItems.map((item) => {
              const active = isNavActive(pathname, item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-mint/25 text-deep-green"
                      : "text-deep-green/80 hover:bg-mint/10"
                  )}
                >
                  <item.icon className="size-4 shrink-0" strokeWidth={2} />
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="mt-2 flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-deep-green/70 hover:bg-mint/10"
            >
              Accueil du site
            </Link>
            <Link
              href="/campaigns"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-deep-green/70 hover:bg-mint/10"
            >
              Campagnes publiques
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
