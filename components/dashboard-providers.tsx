"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export function DashboardProviders({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <TooltipProvider>
      <SidebarProvider style={style}>{children}</SidebarProvider>
    </TooltipProvider>
  );
}
