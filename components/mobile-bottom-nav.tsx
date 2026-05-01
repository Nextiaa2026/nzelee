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
  LogOut,
  ShieldCheck,
  LayoutDashboard,
  Wallet2,
  ArrowUpRight
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getDashboardNavItems, dashboardSettingsItem } from "@/lib/dashboard/dashboard-nav-config";
import { signOut, useSession } from "next-auth/react";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  exact?: boolean;
};

const navItems: NavItem[] = [
  {
    href: "/",
    label: "Accueil",
    icon: Home,
  },
  {
    href: "/campaigns",
    label: "Explorer",
    icon: Compass,
  },
  {
    href: "/dashboard/markets",
    label: "Marchés",
    icon: LayoutGrid,
  },
  {
    href: "/dashboard/saved",
    label: "Favoris",
    icon: Heart,
  },
];

const dashboardNavItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Aperçu",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/dashboard/markets",
    label: "Marchés",
    icon: LayoutGrid,
  },
  {
    href: "/dashboard/wallet",
    label: "Banque",
    icon: Wallet2,
  },
  {
    href: "/dashboard/saved",
    label: "Favoris",
    icon: Heart,
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  
  const isDashboard = pathname?.startsWith("/dashboard");
  const currentItems = isDashboard ? dashboardNavItems : navItems;
  
  // Dashboard items from config
  const dashboardItemsList = getDashboardNavItems(); 


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
        {currentItems.map((item) => {
          const isActive = item.exact 
            ? pathname === item.href 
            : pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
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
                Plus
              </span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[90vh] rounded-t-[2.5rem] border-t-0 p-0 overflow-hidden bg-surface/98 backdrop-blur-2xl">
            <div className="flex h-full flex-col">
              <div className="flex justify-center pt-3">
                <div className="h-1.5 w-12 rounded-full bg-foreground/10" />
              </div>

              {/* Profile Header */}
              <div className="px-6 pt-10 pb-4">
                <div className="flex items-center gap-4 rounded-3xl bg-foreground/[0.03] p-4 ring-1 ring-foreground/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-2">
                    <div className={cn(
                      "text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter",
                      session?.user?.kycStatus === 'APPROVED' ? "bg-mint/20 text-mint border border-mint/30" :
                      session?.user?.kycStatus === 'REJECTED' ? "bg-destructive/10 text-destructive border border-destructive/20" :
                      "bg-amber-100/10 text-amber-500 border border-amber-500/20"
                    )}>
                      {session?.user?.kycStatus === 'APPROVED' ? "Vérifié" : 
                       session?.user?.kycStatus === 'REJECTED' ? "Refusé" :
                       session?.user?.kycStatus === 'UNDER_REVIEW' ? "En cours" : "Non vérifié"}
                    </div>
                  </div>
                  <Avatar className="size-14 border-2 border-background shadow-sm">
                    <AvatarImage src={session?.user?.image ?? ""} alt={session?.user?.name ?? "Guest"} />
                    <AvatarFallback className="bg-mint text-lg font-bold text-deep-green">
                      {(session?.user?.name ?? "G")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <h3 className="font-display text-lg truncate font-medium">
                      {session?.user?.name ?? "Invité"}
                    </h3>
                    <div className="flex flex-col">
                      <p className="text-xs text-foreground/40 truncate font-light">
                        {session?.user?.email ?? "nzelle@platform.com"}
                      </p>
                      {session && (
                        <SheetClose asChild>
                          <Link href="/dashboard/settings" className="text-[10px] text-mint font-medium mt-1 hover:underline">
                            Voir le profil
                          </Link>
                        </SheetClose>
                      )}
                    </div>
                  </div>
                  {session ? (
                    <SheetClose asChild>
                      <Link href="/dashboard/settings" className="rounded-full bg-foreground/5 p-2 text-foreground/40 active:scale-90 transition-transform">
                        <dashboardSettingsItem.icon className="size-5" strokeWidth={1.2} />
                      </Link>
                    </SheetClose>
                  ) : (
                    <SheetClose asChild>
                      <Link href="/login" className="rounded-full bg-deep-green px-4 py-2 text-xs font-semibold text-deep-green-foreground active:scale-95 transition-transform">
                        Se connecter
                      </Link>
                    </SheetClose>
                  )}
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto overscroll-contain px-6 pb-20">
                {/* Navigation List */}
                <div className="space-y-4">
                  {session && (
                    <div className="space-y-1">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground/30 px-4 py-3">Espace Personnel</h4>
                      <div className="flex flex-col">
                        {dashboardItemsList.map((item) => (
                          <SheetClose key={item.href} asChild>
                            <Link
                              href={item.href}
                              className="flex items-center gap-4 border-b border-foreground/[0.03] px-4 py-4 transition-all active:bg-foreground/5 last:border-0"
                            >
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-deep-green/5">
                                <item.icon className="h-5 w-5 text-deep-green" strokeWidth={1} />
                              </div>
                              <span className="text-sm font-normal text-foreground/80">{item.label}</span>
                              {currentItems.some(nav => nav.href === item.href) && (
                                <div className="ml-auto h-1 w-1 rounded-full bg-deep-green/10" />
                              )}
                              <ArrowUpRight className="ml-auto h-4 w-4 text-foreground/20" />
                            </Link>
                          </SheetClose>
                        ))}
                        <SheetClose asChild>
                          <Link
                            href={dashboardSettingsItem.href}
                            className="flex items-center gap-4 border-b border-foreground/[0.03] px-4 py-4 transition-all active:bg-foreground/5 last:border-0"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-deep-green/5">
                              <dashboardSettingsItem.icon className="h-5 w-5 text-deep-green" strokeWidth={1} />
                            </div>
                            <span className="text-sm font-normal text-foreground/80">{dashboardSettingsItem.label}</span>
                            <ArrowUpRight className="ml-auto h-4 w-4 text-foreground/20" />
                          </Link>
                        </SheetClose>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground/30 px-4 py-3">Plateforme</h4>
                    <div className="flex flex-col">
                      {[
                        { href: "/about", label: "À propos", icon: Info },
                        { href: "/help", label: "Centre d&apos;aide", icon: HelpCircle },
                        { href: "/contact", label: "Contactez-nous", icon: MessageSquare },
                        { href: "/campaigns", label: "Parcourir les campagnes", icon: Compass },
                        { href: "/terms-of-service", label: "Conditions d&apos;utilisation", icon: FileText },
                        { href: "/privacy-policy", label: "Politique de confidentialité", icon: Lock },
                        { href: "/legal", label: "Mentions légales", icon: ShieldCheck },
                      ].map((item) => (
                        <SheetClose key={item.href} asChild>
                          <Link
                            href={item.href}
                            className="flex items-center gap-4 border-b border-foreground/[0.03] px-4 py-4 transition-all active:bg-foreground/5 last:border-0"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/5">
                              <item.icon className="h-5 w-5 text-foreground/40" strokeWidth={1} />
                            </div>
                            <span className="text-sm font-normal text-foreground/80">{item.label}</span>
                          </Link>
                        </SheetClose>
                      ))}
                    </div>
                  </div>

                  {session && (
                    <div className="pt-6">
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-4 h-16 rounded-2xl border border-destructive/10 bg-destructive/[0.02] text-destructive hover:bg-destructive/5 hover:text-destructive active:bg-destructive/10"
                        onClick={() => void signOut({ callbackUrl: "/" })}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/5">
                          <LogOut className="h-5 w-5" />
                        </div>
                        <span className="font-bold">Se déconnecter</span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
