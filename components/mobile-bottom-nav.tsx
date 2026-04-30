"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Home, 
  Compass, 
  Heart, 
  LayoutGrid, 
  MoreHorizontal,
  Info,
  HelpCircle,
  MessageSquare,
  FileText,
  Lock,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { getDashboardNavItems, dashboardSettingsItem } from "@/lib/dashboard/dashboard-nav-config";
import { signOut } from "next-auth/react";

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
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  
  // Dashboard items from config
  const dashboardItems = getDashboardNavItems(); // isAdmin doesn't matter for the list

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
                "relative flex flex-col items-center justify-center gap-1.5 rounded-2xl px-5 py-2.5 transition-all duration-300",
                isActive
                  ? "text-deep-green"
                  : "text-foreground/45 hover:text-foreground",
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-active"
                  className="absolute inset-0 z-0 rounded-2xl bg-deep-green/5"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon
                className={cn(
                  "relative z-10 h-5 w-5 transition-transform duration-300",
                  isActive && "scale-110"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={cn(
                  "relative z-10 text-[10px] font-medium tracking-wide transition-all duration-300",
                  isActive ? "font-bold opacity-100" : "opacity-80",
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* More Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button
              className={cn(
                "relative flex flex-col items-center justify-center gap-1.5 rounded-2xl px-5 py-2.5 transition-all duration-300",
                isOpen
                  ? "text-deep-green"
                  : "text-foreground/45 hover:text-foreground",
              )}
            >
              <MoreHorizontal
                className={cn(
                  "relative z-10 h-5 w-5 transition-transform duration-300",
                  isOpen && "scale-110"
                )}
                strokeWidth={isOpen ? 2.5 : 2}
              />
              <span
                className={cn(
                  "relative z-10 text-[10px] font-medium tracking-wide transition-all duration-300",
                  isOpen ? "font-bold opacity-100" : "opacity-80",
                )}
              >
                More
              </span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-[2.5rem] border-t-0 p-0 overflow-hidden bg-white/95 backdrop-blur-2xl">
            <div className="flex h-full flex-col">
              <div className="flex justify-center pt-3">
                <div className="h-1.5 w-12 rounded-full bg-foreground/10" />
              </div>
              <SheetHeader className="px-6 py-6 text-left">
                <SheetTitle className="font-display text-2xl font-bold">Navigation</SheetTitle>
              </SheetHeader>
              
              <div className="flex-1 overflow-y-auto px-6 pb-12">
                {/* Dashboard Section */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-1">Dashboard</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {dashboardItems.map((item) => (
                      <SheetClose key={item.href} asChild>
                        <Link
                          href={item.href}
                          className="flex items-center gap-3 rounded-2xl bg-foreground/5 p-4 transition-all hover:bg-foreground/10 active:scale-95"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/5">
                            <item.icon className="h-4 w-4 text-deep-green" />
                          </div>
                          <span className="text-xs font-semibold">{item.label}</span>
                        </Link>
                      </SheetClose>
                    ))}
                    <SheetClose asChild>
                      <Link
                        href={dashboardSettingsItem.href}
                        className="flex items-center gap-3 rounded-2xl bg-foreground/5 p-4 transition-all hover:bg-foreground/10 active:scale-95"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/5">
                          <dashboardSettingsItem.icon className="h-4 w-4 text-deep-green" />
                        </div>
                        <span className="text-xs font-semibold">Settings</span>
                      </Link>
                    </SheetClose>
                  </div>
                </div>

                {/* Main Site Section */}
                <div className="mt-8 space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-1">Discover & Support</h4>
                  <div className="grid gap-2">
                    {[
                      { href: "/about", label: "About Us", icon: Info },
                      { href: "/help", label: "Help Center", icon: HelpCircle },
                      { href: "/contact", label: "Contact Us", icon: MessageSquare },
                      { href: "/terms-of-service", label: "Terms of Service", icon: FileText },
                      { href: "/privacy-policy", label: "Privacy Policy", icon: Lock },
                    ].map((item) => (
                      <SheetClose key={item.href} asChild>
                        <Link
                          href={item.href}
                          className="flex items-center gap-4 rounded-2xl px-4 py-3 transition-all hover:bg-foreground/5 active:bg-foreground/10"
                        >
                          <item.icon className="h-5 w-5 text-foreground/50" />
                          <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                </div>

                {/* Account / Action Section */}
                <div className="mt-8 border-t border-foreground/5 pt-6">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-4 h-12 rounded-2xl text-destructive hover:bg-destructive/5 hover:text-destructive active:bg-destructive/10"
                    onClick={() => void signOut({ callbackUrl: "/" })}
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-semibold">Sign Out</span>
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
