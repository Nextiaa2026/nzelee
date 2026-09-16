"use client";

import * as React from "react";
import Link from "next/link";
import {
  BankIcon,
  DashboardSquare01Icon,
  HandCoinsIcon,
  Home09Icon,
  Notification03Icon,
  SecurityLockIcon,
  Rocket01Icon,
  TransactionIcon,
  UserMultipleIcon,
  CustomerSupportIcon,
} from "@hugeicons/core-free-icons";

import { CompanyBrandMark } from "@/components/company-brand-mark";
import { Hugeicon } from "@/components/hugeicon";
import { SITE_NAME } from "@/lib/brand";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export type DashboardSidebarUser = {
  name: string;
  email: string;
  avatar: string;
};

const navMain = [
  {
    title: "Aperçu",
    url: "/admin",
    icon: <Hugeicon icon={DashboardSquare01Icon} />,
    exact: true,
  },
  {
    title: "Utilisateurs",
    url: "/admin/users",
    icon: <Hugeicon icon={UserMultipleIcon} />,
  },
  {
    title: "Campagnes",
    url: "/admin/campaigns",
    icon: <Hugeicon icon={Rocket01Icon} />,
  },
  {
    title: "Tickets",
    url: "/admin/tickets",
    icon: <Hugeicon icon={CustomerSupportIcon} />,
  },
  {
    title: "Investissements",
    url: "/admin/investments",
    icon: <Hugeicon icon={HandCoinsIcon} />,
  },
  {
    title: "Transactions",
    url: "/admin/transactions",
    icon: <Hugeicon icon={TransactionIcon} />,
  },
  {
    title: "Retraits",
    url: "/admin/withdrawals",
    icon: <Hugeicon icon={BankIcon} />,
  },
  {
    title: "Vérifications KYC",
    url: "/admin/kyc",
    icon: <Hugeicon icon={SecurityLockIcon} />,
  },
  {
    title: "Notifications",
    url: "/admin/notifications",
    icon: <Hugeicon icon={Notification03Icon} />,
  },
];

const navSecondary = [
  {
    title: "Accueil",
    url: "/",
    icon: <Hugeicon icon={Home09Icon} />,
  },
];

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: DashboardSidebarUser }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link
                href="/admin"
                title={SITE_NAME}
                className="flex flex-col items-start gap-1 leading-tight"
              >
                <CompanyBrandMark variant="horizontalDarkBg" href={null} />
                <span className="text-xs font-medium text-sidebar-foreground/70">
                  Admin
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} basePath="/admin" showQuickCreate={false} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
