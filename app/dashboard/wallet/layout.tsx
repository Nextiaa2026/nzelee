import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portefeuille",
  description: "Solde et activité de paiement de votre portefeuille Nzelee.",
};

export default function WalletLayout({ children }: { children: React.ReactNode }) {
  return children;
}
