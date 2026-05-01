"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { ChevronDownIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SITE_NAME } from "@/lib/brand";
import { BRAND_LOGOS } from "@/lib/brand-logos";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/campaigns", label: "Campaigns" },
  { href: "/services", label: "What we do" },
  { href: "/about", label: "About us" },
  { href: "/contact", label: "Contact" },
];

const hiddenPrefixes = ["/admin", "/dashboard"];
const hiddenExact = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/onboarding",
];

const scrollCompactThreshold = 56;

export function GlobalSiteHeader() {
  const pathname = usePathname() ?? "/";
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () =>
      setIsScrolled(window.scrollY > scrollCompactThreshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hideOnPrefix = hiddenPrefixes.some((prefix) =>
    pathname.startsWith(prefix),
  );
  const hideOnExact = hiddenExact.includes(pathname);
  const hideOnNestedAuth = pathname.startsWith("/register/");

  if (hideOnPrefix || hideOnExact || hideOnNestedAuth) {
    return null;
  }

  const expandedHome = !isScrolled;

  const navLinkClass = (active: boolean) =>
    cn(
      "transition-colors",
      expandedHome
        ? cn(
            "text-deep-green-foreground/75 hover:text-deep-green-foreground",
            active && "font-medium text-deep-green-foreground",
          )
        : cn(
            "text-white/80 hover:text-white",
            active && "font-medium text-white",
          ),
    );

  const resourcesTriggerClass = cn(
    "inline-flex items-center gap-1.5 outline-none transition-colors",
    expandedHome
      ? "text-deep-green-foreground/75 hover:text-deep-green-foreground"
      : "text-white/80 hover:text-white",
    (pathname.startsWith("/investors") ||
      pathname.startsWith("/help") ||
      pathname.startsWith("/careers") ||
      pathname.startsWith("/press")) &&
      (expandedHome ? "text-deep-green-foreground" : "text-white"),
  );

  const brand = (
    <Link
      href="/"
      className="block shrink-0 transition-opacity duration-300 hover:opacity-90"
    >
      <Image
        src={BRAND_LOGOS.headerOnDark}
        alt={SITE_NAME}
        width={140}
        height={35}
        className="h-7 w-auto md:h-8"
        priority
      />
    </Link>
  );

  const nav = (
    <nav className="hidden items-center gap-6 text-sm md:flex">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className={resourcesTriggerClass}>
          Resources
          <ChevronDownIcon className="size-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="center"
          className="min-w-44 rounded-xl border-white/10 bg-[#111] text-white"
        >
          <DropdownMenuItem asChild>
            <Link href="/investors" className="cursor-pointer">
              Investors
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/help" className="cursor-pointer">
              Help
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/careers" className="cursor-pointer">
              Careers
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/press" className="cursor-pointer">
              Press
            </Link>
          </DropdownMenuItem>
          {session?.user?.role === "ADMIN" ? (
            <DropdownMenuItem asChild>
              <Link href="/dashboard/projects" className="cursor-pointer">
                Your projects
              </Link>
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
      {navLinks.map((link) => {
        const active =
          pathname === link.href ||
          (link.href !== "/" && pathname.startsWith(link.href));
        return (
          <Link
            key={link.href}
            href={link.href}
            className={navLinkClass(active)}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );



  const sessionMenu = (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex items-center justify-center rounded-full outline-none transition",
          expandedHome
            ? "ring-1 ring-deep-green-foreground/15"
            : "border border-white/20 bg-white/95 p-0.5 hover:bg-white",
        )}
      >
        <Avatar className="size-9">
          <AvatarImage
            src={session?.user?.image ?? ""}
            alt={session?.user?.name ?? "Account"}
          />
          <AvatarFallback className="bg-mint text-xs font-semibold text-deep-green">
            {(session?.user?.name ?? "Account")
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuLabel className="truncate">
          {session?.user?.email ?? "Signed in"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">Account</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/markets">Markets</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/saved">Saved campaigns</Link>
        </DropdownMenuItem>
        {session?.user?.role === "ADMIN" ? (
          <DropdownMenuItem asChild>
            <Link href="/dashboard/projects">Your projects</Link>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem asChild>
          <Link href="/dashboard/notifications">Notifications</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings">Account settings</Link>
        </DropdownMenuItem>
        {session?.user?.role === "ADMIN" ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin">Admin</Link>
            </DropdownMenuItem>
          </>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => void signOut({ callbackUrl: "/" })}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const signIn = (
    <Link
      href="/login"
      className={cn(
        "rounded-full px-5 py-2 text-sm font-medium transition",
        expandedHome
          ? "bg-mint text-deep-green hover:bg-mint/90"
          : "border border-white/20 bg-white text-black hover:bg-white/90",
      )}
    >
      Sign in
    </Link>
  );

  const accountControl = status === "authenticated" ? sessionMenu : signIn;

  if (expandedHome) {
    return (
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 bg-deep-green",
          "transition-[padding,background-color] duration-300 ease-out",
        )}
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 md:py-8">

          {brand}
          {nav}
          <div className="flex items-center gap-2 pl-2">{accountControl}</div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-transparent px-4 py-4 transition-[padding] duration-300 md:py-5">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center">
        <div className="flex min-h-14 w-full max-w-3xl items-center justify-between rounded-full border border-white/10 bg-deep-green px-4 py-3 text-white shadow-xl ring-1 ring-black/10 transition-all duration-300 md:min-h-16 md:px-6 md:py-3.5">

          {brand}
          {nav}
          <div className="flex items-center gap-2 pl-2">{accountControl}</div>
        </div>
      </div>
    </header>
  );
}
