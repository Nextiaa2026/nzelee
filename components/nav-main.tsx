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

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
  }[]
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="min-w-8 bg-mint text-mint-foreground duration-200 ease-linear hover:bg-mint/90 hover:text-mint-foreground active:bg-mint/90 active:text-mint-foreground"
            >
              <Hugeicon icon={Add01Icon} className="text-mint-foreground" />
              <span>Quick Create</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <Hugeicon icon={Mail01Icon} size={18} />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                  className="text-sidebar-foreground/85 hover:bg-white/12 hover:text-sidebar-foreground data-[active=true]:bg-white/22 data-[active=true]:text-sidebar-foreground data-[active=true]:shadow-[inset_0_0_0_1px_oklch(1_0_0/0.18)]"
                isActive={
                  item.url !== "#" &&
                  (item.url === "/admin"
                    ? pathname === "/admin"
                    : pathname === item.url ||
                      pathname.startsWith(`${item.url}/`))
                }
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
