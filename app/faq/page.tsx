import type { Metadata } from "next";

import { PageHero } from "@/components/page-shell";
import { FaqSection } from "@/components/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Questions fréquentes sur les comptes Nzelee, l'investissement et la conformité.",
};

export default function FaqPage() {
  return (
    <main>
      <PageHero
        eyebrow="Centre d'aide"
        title="Questions fréquentes"
        subtitle="Trouvez des réponses sur Nzelee, l'investissement et la plateforme."
      />
      <FaqSection className="-mt-16 py-16 md:py-20" />
    </main>
  );
}
