import Link from "next/link";
import { CompanyBrandMark } from "@/components/company-brand-mark";

const footerCols = [
  {
    title: "Entreprise",
    links: [
      { href: "/about", label: "À propos" },
      { href: "/services", label: "Services" },
      { href: "/careers", label: "Carrières" },
      { href: "/press", label: "Presse" },
    ],
  },
  {
    title: "Légal",
    links: [
      { href: "/terms-of-service", label: "Conditions d'utilisation" },
      { href: "/privacy-policy", label: "Politique de confidentialité" },
      { href: "/cookie-policy", label: "Politique relative aux cookies" },
    ],
  },
  {
    title: "Assistance",
    links: [
      { href: "/help", label: "Centre d'aide" },
      { href: "/contact", label: "Contactez-nous" },
      { href: "/login", label: "Se connecter" },
      { href: "/register", label: "Créer un compte" },
    ],
  },
];

export function GlobalSiteFooter() {
  return (
    <footer className="border-t border-deep-green-foreground/10 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 border-b border-deep-green-foreground/10 pb-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <CompanyBrandMark variant="horizontalLightBg" className="mb-4" />
            <p className="mt-3 max-w-md text-sm text-foreground/70">
              Investissement sur le marché privé avec des annonces structurées, des outils pour investisseurs clairs et des flux de travail transparents axés sur la conformité.
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
          © {new Date().getFullYear()} Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
