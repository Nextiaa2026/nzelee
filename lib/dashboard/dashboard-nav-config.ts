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

/** Primary investor top-nav / mobile sheet routes (single source of truth). */
export function getDashboardNavItems(): DashboardNavItem[] {
  return [
    { href: "/dashboard", label: "Aperçu", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/markets", label: "Marchés", icon: Store },
    { href: "/dashboard/investments", label: "Investissements", icon: TrendingUp },
    { href: "/dashboard/transactions", label: "Transactions", icon: History },
    { href: "/dashboard/wallet", label: "Portefeuille", icon: Wallet2 },
    { href: "/dashboard/withdrawals", label: "Retraits", icon: Banknote },
    { href: "/dashboard/saved", label: "Favoris", icon: Bookmark },
    { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  ];
}

export const dashboardAdminConsoleItem = {
  href: "/admin",
  label: "Console Admin",
  icon: ShieldCheck,
} as const;

export const dashboardSettingsItem: DashboardNavItem = {
  href: "/dashboard/settings",
  label: "Paramètres",
  icon: Settings,
};
