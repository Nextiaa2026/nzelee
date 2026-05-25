"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BellIcon } from "lucide-react";
import { useMyNotifications } from "@/hooks/use-notifications";

import { DashboardWalletHeaderPill } from "@/components/dashboard/dashboard-wallet-header-pill";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const titles: Record<string, string> = {
  "/dashboard": "Aperçu",
  "/dashboard/markets": "Marchés",
  "/dashboard/investments": "Investissements",
  "/dashboard/transactions": "Transactions",
  "/dashboard/wallet": "Portefeuille",
  "/dashboard/withdrawals": "Retraits",
  "/dashboard/saved": "Favoris",
  "/dashboard/notifications": "Notifications",
  "/dashboard/settings": "Paramètres",
  "/dashboard/profile": "Profil",
  "/dashboard/projects": "Projets",
};

function resolveTitle(pathname: string) {
  if (titles[pathname]) return titles[pathname];
  if (pathname.startsWith("/dashboard/projects/new")) return "Nouveau projet";
  if (pathname.startsWith("/dashboard/projects/campaigns")) return "Campagne";
  if (pathname.startsWith("/dashboard/projects")) return "Projets";
  return "Mon compte";
}

export function DashboardSiteHeader() {
  const pathname = usePathname() ?? "/dashboard";
  const title = resolveTitle(pathname);
  const { data: notifications } = useMyNotifications();

  const unreadCount = notifications?.filter((n) => !n.readAt).length ?? 0;
  const recentNotifications = notifications?.slice(0, 5) ?? [];

  return (
    <header className="sticky top-0 z-20 flex h-(--header-height) shrink-0 items-center gap-2 border-b border-deep-green/10 bg-white/90 backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 text-deep-green hover:bg-mint/15 hover:text-deep-green" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h1 className="truncate font-display text-base font-semibold text-deep-green">
            {title}
          </h1>
        </div>

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
            className="w-80 border border-deep-green/10 bg-mint p-1.5 text-deep-green shadow-lg"
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
                    className="flex cursor-pointer flex-col items-start gap-1 rounded-lg p-3 focus:bg-deep-green/10 focus:text-deep-green data-highlighted:bg-deep-green/10"
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
                <DropdownMenuItem
                  asChild
                  className="rounded-lg focus:bg-deep-green/10 focus:text-deep-green data-highlighted:bg-deep-green/10"
                >
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
      </div>
    </header>
  );
}
