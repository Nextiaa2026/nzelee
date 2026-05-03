import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parcourir les campagnes",
  description: "Explorez les campagnes en cours et financées sur Nexiaa. Enregistrez les annonces dans votre tableau de bord.",
};

export default function CampaignsLayout({ children }: { children: React.ReactNode }) {
  return <div className="bg-white text-foreground">{children}</div>;
}
