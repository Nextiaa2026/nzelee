import type { Metadata } from "next";

import { LegalLayout } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Conditions d'utilisation",
  description:
    "Règles d'utilisation de la place de marché Nzelee, des comptes et des fonctionnalités investisseur.",
};

export default function TermsOfServicePage() {
  return (
    <LegalLayout title="Conditions d'utilisation" updated="Avril 2026">
      <p>
        Les présentes conditions régissent votre utilisation de Nzelee — la
        plateforme pour découvrir des <strong>campagnes</strong>, passer des{" "}
        <strong>promesses</strong>, gérer votre compte et (pour les porteurs)
        publier des annonces. En vous inscrivant ou en continuant à utiliser le
        service, vous acceptez ces conditions et les politiques qui y sont
        liées.
      </p>

      <h2>Éligibilité et comptes</h2>
      <p>
        Vous devez être juridiquement capable de conclure un contrat dans votre
        juridiction et garder vos identifiants confidentiels.
      </p>

      <h2>Avertissement sur les risques</h2>
      <p>
        Tout investissement comporte un risque, y compris une perte en capital.
        Rien sur Nzelee ne constitue un conseil juridique, fiscal ou
        d&apos;investissement personnalisé.
      </p>

      <h2>Usage acceptable</h2>
      <ul>
        <li>Aucune activité illégale, frauduleuse ou abusive.</li>
        <li>Aucune tentative de contourner les contrôles de sécurité ou les limites.</li>
        <li>
          Aucune fausse déclaration d&apos;identité, d&apos;éligibilité ou
          d&apos;informations KYC.
        </li>
      </ul>

      <h2>Modifications</h2>
      <p>
        Nous pouvons mettre à jour ces conditions au fil de l&apos;évolution des
        services. Les changements importants seront communiqués dans
        l&apos;application ou par e-mail lorsque requis.
      </p>
    </LegalLayout>
  );
}
