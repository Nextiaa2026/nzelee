import type { Metadata } from "next";

import { LegalLayout } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Comment Nzelee traite les données des comptes, campagnes, promesses et vérifications.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Politique de confidentialité" updated="Avril 2026">
      <p>
        Nzelee met en relation <strong>porteurs de projets</strong> et{" "}
        <strong>investisseurs</strong> autour de campagnes de financement. Cette
        politique explique ce que nous collectons — compte, campagne, promesse et
        vérification — comment nous l&apos;utilisons pour faire fonctionner le
        service et les choix dont vous disposez.
      </p>

      <h2>Informations collectées</h2>
      <ul>
        <li>
          Détails de compte et de profil fournis à l&apos;inscription ou dans les
          paramètres.
        </li>
        <li>
          Informations de campagne et de promesse (titres, descriptions,
          montants, statuts et métadonnées associées).
        </li>
        <li>
          Documents KYC et de vérification lorsque l&apos;éligibilité ou la
          réglementation l&apos;exigent.
        </li>
        <li>
          Données techniques, journaux de sécurité et informations d&apos;appareil
          nécessaires au fonctionnement sûr.
        </li>
        <li>
          Résultats de prestataires de confiance pour la prévention de la fraude,
          les paiements ou l&apos;identité.
        </li>
      </ul>

      <h2>Utilisation des informations</h2>
      <p>
        Nous utilisons les données pour exploiter les services, vérifier les
        utilisateurs, traiter l&apos;activité, détecter la fraude, respecter les
        obligations légales et améliorer le produit.
      </p>

      <h2>Partage et conservation</h2>
      <p>
        Les données peuvent être partagées avec des prestataires opérationnels et
        les autorités lorsque la loi l&apos;exige. Nous les conservons selon les
        obligations légales, opérationnelles et réglementaires.
      </p>

      <h2>Vos droits</h2>
      <p>
        Selon votre juridiction, vous pouvez demander l&apos;accès, la correction,
        la suppression ou vous opposer à certains traitements en contactant le
        support.
      </p>
    </LegalLayout>
  );
}
