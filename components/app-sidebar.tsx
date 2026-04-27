"use client";

import * as React from "react";
import {
  BankIcon,
  Building03Icon,
  CommandIcon,
  DashboardSquare01Icon,
  HandCoinsIcon,
  Home09Icon,
  SecurityLockIcon,
  Rocket01Icon,
  TransactionIcon,
  UserMultipleIcon,
} from "@hugeicons/core-free-icons";

import { Hugeicon } from "@/components/hugeicon";
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
    title: "Properties",
    url: "/admin/properties",
    icon: <Hugeicon icon={Building03Icon} />,
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
              <a href="/admin">
                <Hugeicon icon={CommandIcon} className="size-5" size={20} />
                <span className="text-base font-semibold">Nexiaa Admin</span>
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
