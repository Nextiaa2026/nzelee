import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  Bell,
  Bookmark,
  History,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Store,
  TrendingUp,
  Wallet2,
} from "lucide-react";

export type DashboardNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};

/** Primary sidebar / mobile sheet routes (single source of truth). */
export function getDashboardNavItems(): DashboardNavItem[] {
  return [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/markets", label: "Markets", icon: Store },
    { href: "/dashboard/investments", label: "Investments", icon: TrendingUp },
    { href: "/dashboard/transactions", label: "Transactions", icon: History },
    { href: "/dashboard/wallet", label: "Wallet", icon: Wallet2 },
    { href: "/dashboard/withdrawals", label: "Withdrawals", icon: Banknote },
    { href: "/dashboard/saved", label: "Bookmarks", icon: Bookmark },
    { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  ];
}

export const dashboardAdminConsoleItem = {
  href: "/admin",
  label: "Admin console",
  icon: ShieldCheck,
} as const;

export const dashboardSettingsItem: DashboardNavItem = {
  href: "/dashboard/settings",
  label: "Settings",
  icon: Settings,
};
