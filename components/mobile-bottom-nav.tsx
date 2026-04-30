"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Heart, User, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/",
    label: "Home",
    icon: Home,
  },
  {
    href: "/campaigns",
    label: "Explore",
    icon: Compass,
  },
  {
    href: "/dashboard/markets",
    label: "Markets",
    icon: LayoutGrid,
  },
  {
    href: "/dashboard/saved",
    label: "Saved",
    icon: Heart,
  },
  {
    href: "/dashboard",
    label: "Account",
    icon: User,
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  // Don't show on auth pages, admin, or onboarding
  if (
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/onboarding") ||
    pathname?.startsWith("/kyc")
  ) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/40 bg-white/95 backdrop-blur-lg md:hidden safe-area-inset-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-xl px-4 py-2 transition-colors",
                isActive
                  ? "text-deep-green"
                  : "text-foreground/60 hover:text-foreground",
              )}
            >
              <Icon
                className={cn("h-5 w-5", isActive && "fill-deep-green/10")}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={cn(
                  "text-[10px] font-medium",
                  isActive && "font-semibold",
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
