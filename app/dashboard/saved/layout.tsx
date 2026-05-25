import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Campagnes sauvegardées",
  description: "Campagnes que vous avez enregistrées sur Nzelee.",
};

export default function SavedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
