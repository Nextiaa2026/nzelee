"use client";

import * as React from "react";
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
    title: "Overview",
    url: "/admin",
    icon: <Hugeicon icon={DashboardSquare01Icon} />,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: <Hugeicon icon={UserMultipleIcon} />,
  },
  {
    title: "Campaigns",
    url: "/admin/campaigns",
    icon: <Hugeicon icon={Rocket01Icon} />,
  },
  {
    title: "Tickets",
    url: "/admin/tickets",
    icon: <Hugeicon icon={CustomerSupportIcon} />,
  },
  {
    title: "Investments",
    url: "/admin/investments",
    icon: <Hugeicon icon={HandCoinsIcon} />,
  },
  {
    title: "Transactions",
    url: "/admin/transactions",
    icon: <Hugeicon icon={TransactionIcon} />,
  },
  {
    title: "Withdrawals",
    url: "/admin/withdrawals",
    icon: <Hugeicon icon={BankIcon} />,
  },
  {
    title: "KYC Reviews",
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
    title: "Home",
    url: "/",
    icon: <Hugeicon icon={Home09Icon} />,
  },
];

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: DashboardSidebarUser }) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/admin" title={SITE_NAME}>
                <span className="flex flex-col gap-0.5 leading-tight">
                  <span className="text-sm font-bold tracking-tight text-sidebar-foreground">
                    {SITE_NAME}
                  </span>
                  <span className="text-xs font-medium text-sidebar-foreground/70">
                    Admin
                  </span>
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
