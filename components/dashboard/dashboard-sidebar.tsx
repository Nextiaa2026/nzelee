"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { CompanyBrandMark } from "@/components/company-brand-mark";
import { dashboardPanelClass } from "@/components/dashboard/dashboard-page-shell";
import { Button } from "@/components/ui/button";
import {
  getDashboardNavItems,
} from "@/lib/dashboard/dashboard-nav-config";
import { cn } from "@/lib/utils";



function navActive(pathname: string, href: string, exact?: boolean) {
  return exact ? pathname === href : pathname.startsWith(href);
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const items = getDashboardNavItems();

  return (
    <aside className="hidden w-full min-w-0 max-w-[240px] shrink-0 lg:block sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto scrollbar-hide">
      <div className="space-y-4">
        <div className="flex justify-center px-1 pb-1 lg:justify-start">
          <CompanyBrandMark variant="horizontalLightBg" href="/dashboard" />
        </div>
        <nav className={cn(dashboardPanelClass, "p-3 shadow-none")}>
          <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-widest text-foreground/45">
            Menu
          </p>
          <div className="space-y-0.5">
            {items.map((item) => {
              const active = navActive(pathname, item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-deep-green text-deep-green-foreground shadow-sm"
                      : "text-foreground/70 hover:bg-surface-muted hover:text-foreground",
                  )}
                >
                  <item.icon className="size-4 shrink-0 opacity-90" />
                  <span className="flex-1 truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          whileHover={{ y: -2 }}
          className="overflow-hidden rounded-2xl border border-deep-green-foreground/15 bg-hero-bg p-4 text-deep-green-foreground shadow-none"
        >
          <div className="text-[10px] font-bold uppercase tracking-widest text-mint">
            Conseil
          </div>
          <p className="mt-2 text-xs leading-snug text-deep-green-foreground/85">
            Enregistrez les campagnes qui vous plaisent, puis investissez quand vous êtes prêt — votre portefeuille et vos promesses restent synchronisés.
          </p>
          <Button
            asChild
            size="sm"
            className="mt-3 h-8 rounded-full bg-mint px-3 text-xs font-medium text-deep-green hover:bg-mint/90"
          >
            <Link href="/dashboard/saved">Favoris</Link>
          </Button>
        </motion.div>
      </div>
    </aside>
  );
}
