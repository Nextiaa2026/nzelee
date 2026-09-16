"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export function DashboardProviders({
  children,
  style,
  defaultOpen = true,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  defaultOpen?: boolean;
}) {
  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={defaultOpen} style={style}>
        {children}
      </SidebarProvider>
    </TooltipProvider>
  );
}
