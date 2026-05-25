"use client";

import * as React from "react";
import Link from "next/link";
import { Home09Icon, Rocket01Icon } from "@hugeicons/core-free-icons";

import { CompanyBrandMark } from "@/components/company-brand-mark";
import { Hugeicon } from "@/components/hugeicon";
import { SITE_NAME } from "@/lib/brand";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  getDashboardNavItems,
  dashboardSettingsItem,
  dashboardAdminConsoleItem,
} from "@/lib/dashboard/dashboard-nav-config";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { DashboardSidebarUser } from "@/components/app-sidebar";

const navSecondary = [
  {
    title: "Accueil",
    url: "/",
    icon: <Hugeicon icon={Home09Icon} />,
  },
  {
    title: "Campagnes",
    url: "/campaigns",
    icon: <Hugeicon icon={Rocket01Icon} />,
  },
];

export function InvestorAppSidebar({
  user,
  isAdmin = false,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: DashboardSidebarUser;
  isAdmin?: boolean;
}) {
  const navMain = [
    ...getDashboardNavItems().map((item) => ({
      title: item.label,
      url: item.href,
      icon: <item.icon className="size-4 shrink-0" strokeWidth={2} />,
      exact: item.exact,
    })),
    {
      title: dashboardSettingsItem.label,
      url: dashboardSettingsItem.href,
      icon: (
        <dashboardSettingsItem.icon className="size-4 shrink-0" strokeWidth={2} />
      ),
    },
    ...(isAdmin
      ? [
          {
            title: dashboardAdminConsoleItem.label,
            url: dashboardAdminConsoleItem.href,
            icon: (
              <dashboardAdminConsoleItem.icon
                className="size-4 shrink-0"
                strokeWidth={2}
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link
                href="/dashboard"
                title={SITE_NAME}
                className="flex flex-col items-start gap-1 leading-tight"
              >
                <CompanyBrandMark variant="horizontalDarkBg" href={null} />
                <span className="text-xs font-medium text-sidebar-foreground/70">
                  Mon compte
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={navMain}
          basePath="/dashboard"
          showQuickCreate={false}
        />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={user}
          settingsHref="/dashboard/settings"
          notificationsHref="/dashboard/notifications"
        />
      </SidebarFooter>
    </Sidebar>
  );
}
