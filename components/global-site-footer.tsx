import Link from "next/link";

const faqPreview = [
  {
    q: "Who can invest on Nexiaa?",
    a: "Nexiaa currently supports accredited investors, with identity and eligibility checks completed during onboarding.",
  },
  {
    q: "How long does onboarding take?",
    a: "Account setup is a few minutes, while verification review is usually completed within one business day.",
  },
  {
    q: "What is the minimum investment?",
    a: "Minimum commitment depends on the offering. Some start low, while premium listings can require higher tickets.",
  },
  {
    q: "Are returns guaranteed?",
    a: "No. All investing involves risk, including potential loss of principal. Projected returns are estimates only.",
  },
  {
    q: "When do I need KYC?",
    a: "You can complete KYC during onboarding or later from your dashboard before making your first investment.",
  },
  {
    q: "How are distributions paid?",
    a: "When applicable, distributions are sent to your linked payout account based on each offering's schedule.",
  },
];

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
            <h3 className="font-display text-xl text-foreground">Nexiaa</h3>
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

        <div className="pt-10">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h4 className="font-display text-2xl text-foreground">Frequently asked questions</h4>
            <Link
              href="/help"
              className="rounded-full border border-deep-green-foreground/20 px-4 py-2 text-xs font-medium text-deep-green transition hover:bg-mint/15"
            >
              See more FAQs
            </Link>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {faqPreview.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-deep-green-foreground/10 bg-card px-4 py-3"
              >
                <summary className="cursor-pointer list-none text-sm font-medium text-foreground">
                  {item.q}
                </summary>
                <p className="mt-2 text-sm text-foreground/70">{item.a}</p>
              </details>
            ))}
          </div>
        </div>

        <p className="pt-10 text-center text-xs text-foreground/45">
          © {new Date().getFullYear()} Nexiaa. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
