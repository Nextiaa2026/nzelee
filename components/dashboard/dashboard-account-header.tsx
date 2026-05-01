"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  ShieldCheck,
} from "lucide-react";

import { CompanyBrandMark } from "@/components/company-brand-mark";
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
import { useUnreadNotificationCount } from "@/hooks/use-notifications";
import { cn } from "@/lib/utils";


export function DashboardAccountHeader({
  user,
  kycStatus,
}: {
  user: { name: string; email: string; avatar?: string };
  kycStatus?: string | null;
}) {
  const { data: unread = 0 } = useUnreadNotificationCount();

  const getKycStatusDisplay = (status: string | null | undefined) => {
    switch (status) {
      case "APPROVED":
        return {
          label: "Vérifié",
          color: "bg-green-100 text-green-700 border-green-200",
        };
      case "UNDER_REVIEW":
        return {
          label: "En examen",
          color: "bg-yellow-100 text-yellow-700 border-yellow-200",
        };
      case "REJECTED":
        return {
          label: "Rejeté",
          color: "bg-red-100 text-red-700 border-red-200",
        };
      case "EXPIRED":
        return {
          label: "Expiré",
          color: "bg-gray-100 text-gray-700 border-gray-200",
        };
      default:
        return {
          label: "En attente",
          color: "bg-gray-100 text-gray-700 border-gray-200",
        };
    }
  };

  const kycDisplay = getKycStatusDisplay(kycStatus);

  return (
    <header className="sticky top-0 z-40 border-t-4 border-t-deep-green border-b border-foreground/5 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-2.5 md:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          {/* Removed mobile hamburger menu as we now have bottom nav */}
          
          <CompanyBrandMark
            variant="horizontalLightBg"
            href="/dashboard"
            className="sm:h-9"
          />
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
                <span className="hidden xs:inline">{kycDisplay.label}</span>
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
                  Paramètres
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                onClick={() => void signOut({ callbackUrl: "/" })}
              >
                <LogOut className="size-4 opacity-70" />
                Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
