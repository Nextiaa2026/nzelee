"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDownIcon, GalleryVerticalEndIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const navLinks = [
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

export function GlobalSiteHeader() {
  const pathname = usePathname() ?? "/";

  const hideOnPrefix = hiddenPrefixes.some((prefix) =>
    pathname.startsWith(prefix),
  );
  const hideOnExact = hiddenExact.includes(pathname);
  const hideOnNestedAuth = pathname.startsWith("/register/");

  if (hideOnPrefix || hideOnExact || hideOnNestedAuth) {
    return null;
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-transparent px-4 py-4">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center">
        <div className="flex w-full max-w-3xl items-center justify-between rounded-full border border-white/10 bg-[#0a0a0a] px-3 py-2 text-white shadow-xl ring-1 ring-black/10">
        <Link
          href="/"
          className="flex items-center gap-2 font-medium text-white"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-[#f5e800] text-black">
            <GalleryVerticalEndIcon className="size-4" aria-hidden strokeWidth={2.5} />
          </span>
          <span className="font-display text-sm">Nexiaa</span>
        </Link>

        <nav className="hidden items-center gap-5 text-sm md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "inline-flex items-center gap-1.5 text-white/80 outline-none transition-colors hover:text-white",
                (pathname.startsWith("/investors") ||
                  pathname.startsWith("/help") ||
                  pathname.startsWith("/careers") ||
                  pathname.startsWith("/press")) &&
                  "text-white",
              )}
            >
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
                className={cn(
                  "text-white/80 transition-colors hover:text-white",
                  active && "font-medium text-white",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 pl-2">
          <Link
            href="/login"
            className="rounded-full border border-white/20 bg-white px-4 py-1.5 text-xs font-medium text-black transition hover:bg-white/90"
          >
            Sign in
          </Link>
        </div>
      </div>
      </div>
    </header>
  );
}
