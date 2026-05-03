import type { Metadata } from "next";

import { KycView } from "@/components/kyc-view";

export const metadata: Metadata = {
  title: "Vérification d'identité",
  description: "Soumettez vos documents afin que nous puissions confirmer votre éligibilité pour les investissements et les retraits.",
};

export default function KycPage() {
  return (
    <div className="mx-auto w-full max-w-xl px-4 sm:px-6">
      <KycView />
    </div>
  );
}
