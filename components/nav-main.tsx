"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Add01Icon, Mail01Icon } from "@hugeicons/core-free-icons";

import { Hugeicon } from "@/components/hugeicon";

function isNavItemActive(
  pathname: string,
  url: string,
  exact?: boolean,
) {
  if (url === "#") return false;
  if (exact) return pathname === url;
  return pathname === url || pathname.startsWith(`${url}/`);
}

export function NavMain({
  items,
  basePath = "/admin",
  showQuickCreate = true,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
    exact?: boolean
  }[]
  basePath?: string
  showQuickCreate?: boolean
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {showQuickCreate ? (
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <SidebarMenuButton
                tooltip="Quick Create"
                className="min-w-8 bg-mint text-mint-foreground duration-200 ease-linear hover:bg-mint/90 hover:text-mint-foreground active:bg-mint/90 active:text-mint-foreground"
              >
                <Hugeicon icon={Add01Icon} className="text-mint-foreground" />
              <span>Création rapide</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <Hugeicon icon={Mail01Icon} size={18} />
              <span className="sr-only">Messages</span>
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : null}
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                className="text-sidebar-foreground/85 hover:bg-white/12 hover:text-sidebar-foreground data-[active=true]:bg-mint data-[active=true]:text-mint-foreground data-[active=true]:shadow-none"
                isActive={isNavItemActive(
                  pathname,
                  item.url,
                  item.exact ?? item.url === basePath,
                )}
              >
                <Link href={item.url}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
