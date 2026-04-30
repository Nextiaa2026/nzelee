import Link from "next/link";

import { SITE_NAME } from "@/lib/brand";

const footerCols = [
  {
    title: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/services", label: "Services" },
      { href: "/careers", label: "Careers" },
      { href: "/press", label: "Press" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms-of-service", label: "Terms of Service" },
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/cookie-policy", label: "Cookie Policy" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/help", label: "Help center" },
      { href: "/contact", label: "Contact us" },
      { href: "/login", label: "Sign in" },
      { href: "/register", label: "Create account" },
    ],
  },
];

export function GlobalSiteFooter() {
  return (
    <footer className="border-t border-deep-green-foreground/10 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 border-b border-deep-green-foreground/10 pb-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-lg font-bold tracking-tight text-foreground">
              {SITE_NAME}
            </p>
            <p className="mt-3 max-w-md text-sm text-foreground/70">
              Private-market investing with structured listings, clean investor tooling, and
              transparent compliance-first workflows.
            </p>
          </div>

          {footerCols.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold text-foreground">{col.title}</p>
              <ul className="mt-3 space-y-2 text-sm text-foreground/70">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="transition-colors hover:text-deep-green">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="pt-10 text-center text-xs text-foreground/45">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
}
