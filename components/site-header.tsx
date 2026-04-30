"use client";

import { usePathname } from "next/navigation";
import { BellIcon } from "lucide-react";
import { useMyNotifications } from "@/hooks/use-notifications";

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
  "/admin": "Overview",
  "/admin/users": "Users",
  "/admin/campaigns": "Listings",
  "/admin/tickets": "Support Tickets",
  "/admin/investments": "Investments",
  "/admin/transactions": "Transactions",
  "/admin/withdrawals": "Withdrawals",
  "/admin/notifications": "Notifications",
  "/admin/kyc": "KYC Reviews",
  "/admin/properties": "Properties",
};

export function SiteHeader() {
  const pathname = usePathname();
  const title = titles[pathname] ?? "Admin";
  const { data: notifications } = useMyNotifications();

  const unreadCount = notifications?.filter((n) => !n.readAt).length ?? 0;
  const recentNotifications = notifications?.slice(0, 5) ?? [];

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-white transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h1 className="truncate text-base font-medium">{title}</h1>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 rounded-md"
            >
              <BellIcon className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full px-1 text-xs"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-white">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="rounded-md">
                  {unreadCount} new
                </Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {recentNotifications.length > 0 ? (
              <>
                {recentNotifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex flex-col items-start gap-1 p-3 cursor-pointer"
                  >
                    <div className="flex w-full items-start justify-between gap-2">
                      <span className="font-medium text-sm line-clamp-1">
                        {notification.title}
                      </span>
                      {!notification.readAt && (
                        <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                      )}
                    </div>
                    {notification.body && (
                      <span className="text-xs text-muted-foreground line-clamp-2">
                        {notification.body}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a
                    href="/admin/notifications"
                    className="text-center w-full text-sm font-medium"
                  >
                    View all notifications
                  </a>
                </DropdownMenuItem>
              </>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No notifications
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
