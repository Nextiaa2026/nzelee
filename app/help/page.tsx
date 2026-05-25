"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-shell";

export default function HelpPage() {
  return (
    <main>
      <PageHero
        eyebrow="Assistance"
        title="Centre d'aide"
        subtitle="Réponses rapides sur la plateforme, l'inscription et nos politiques."
      />

      <section className="mx-auto -mt-16 max-w-3xl px-4 pb-24">
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="neumorph prose prose-sm max-w-none space-y-5 p-8 text-foreground/80 md:p-12
            [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-3
            [&_ul]:list-disc [&_ul]:space-y-3 [&_ul]:pl-5 [&_li]:text-sm"
        >
          <h2>Questions fréquentes</h2>
          <ul>
            <li>
              <strong className="text-foreground">
                Qui peut investir sur Nzelee ?
              </strong>
              <br />
              Nzelee accompagne les membres qui terminent l&apos;inscription et
              respectent les règles d&apos;éligibilité de chaque offre, avec des
              contrôles d&apos;identité avant le financement.
            </li>
            <li>
              <strong className="text-foreground">
                Combien de temps prend la configuration ?
              </strong>
              <br />
              La création de compte prend quelques minutes. La vérification est
              en général traitée sous un jour ouvré.
            </li>
            <li>
              <strong className="text-foreground">
                Puis-je reporter le KYC à l&apos;inscription ?
              </strong>
              <br />
              Oui. Vous pouvez le compléter plus tard depuis Vérification dans
              votre profil (ou /kyc) avant votre premier investissement.
            </li>
            <li>
              <strong className="text-foreground">
                Où voir mes transactions ?
              </strong>
              <br />
              Utilisez les pages Transactions et Investissements de votre
              tableau de bord pour l&apos;historique et le statut.
            </li>
            <li>
              <strong className="text-foreground">
                Les rendements sont-ils garantis ?
              </strong>
              <br />
              Non. Tout investissement comporte un risque, y compris une perte
              en capital.
            </li>
            <li>
              <strong className="text-foreground">
                Où lire les conditions légales ?
              </strong>
              <br />
              Consultez nos{" "}
              <Link
                href="/terms-of-service"
                className="font-medium text-foreground underline underline-offset-4"
              >
                Conditions d&apos;utilisation
              </Link>
              , notre{" "}
              <Link
                href="/privacy-policy"
                className="font-medium text-foreground underline underline-offset-4"
              >
                Politique de confidentialité
              </Link>{" "}
              et notre{" "}
              <Link
                href="/cookie-policy"
                className="font-medium text-foreground underline underline-offset-4"
              >
                Politique relative aux cookies
              </Link>
              .
            </li>
          </ul>
          <h2>Besoin d&apos;aide supplémentaire ?</h2>
          <p>
            Notre équipe peut vous aider pour l&apos;inscription, votre compte
            et l&apos;utilisation de la plateforme.
          </p>
          <div className="pt-2">
            <Button asChild>
              <Link href="/contact">Contacter le support</Link>
            </Button>
          </div>
        </motion.article>
      </section>
    </main>
  );
}
