import type { Metadata } from "next";

import { LegalLayout } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Politique relative aux cookies",
  description:
    "Cookies et technologies similaires sur Nzelee pour la connexion, les campagnes et l'analyse.",
};

export default function CookiePolicyPage() {
  return (
    <LegalLayout title="Politique relative aux cookies" updated="Avril 2026">
      <p>
        Cette politique décrit comment Nzelee utilise les cookies et technologies
        similaires pour sécuriser les sessions, mémoriser les préférences et
        comprendre l&apos;usage de la plateforme — afin d&apos;améliorer les
        performances sans compromettre les fonctionnalités essentielles.
      </p>

      <h2>Qu&apos;est-ce qu&apos;un cookie ?</h2>
      <p>
        Un cookie est un petit fichier texte placé sur votre appareil pour
        l&apos;authentification, les fonctionnalités, l&apos;analyse et la
        sécurité.
      </p>

      <h2>Types de cookies utilisés</h2>
      <h3>Strictement nécessaires</h3>
      <p>Requis pour la connexion, la sécurité et les parcours de campagne.</p>

      <h3>Fonctionnels</h3>
      <p>Mémorisent les paramètres et préférences d&apos;interface.</p>

      <h3>Analytiques</h3>
      <p>Mesurent les tendances d&apos;usage et la fiabilité (lorsque activés).</p>

      <h2>Gérer les cookies</h2>
      <p>
        Vous pouvez les contrôler via les paramètres du navigateur. Désactiver
        les cookies requis peut affecter des fonctions essentielles du site.
      </p>
    </LegalLayout>
  );
}
