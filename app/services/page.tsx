"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-shell";

export default function ServicesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Services"
        title="Ce que nous proposons"
        subtitle="Des outils pour découvrir les opportunités, mener votre diligence et gérer votre portefeuille au fil du temps."
      />

      <section className="mx-auto -mt-16 max-w-3xl px-4 pb-24">
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="neumorph prose prose-sm max-w-none space-y-5 p-8 text-foreground/80 md:p-12
            [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-3
            [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_li]:text-sm"
        >
          <h2>Pour les investisseurs</h2>
          <ul>
            <li>Annonces structurées et grilles tarifaires transparentes</li>
            <li>
              Tableaux de bord pour les engagements, transactions et retraits
            </li>
            <li>
              Parcours d&apos;identité et d&apos;éligibilité lorsque requis
            </li>
          </ul>
          <h2>Pour les administrateurs</h2>
          <ul>
            <li>Gestion des campagnes et des promesses</li>
            <li>Administration des utilisateurs et rapports</li>
          </ul>
          <div className="flex flex-wrap gap-3 pt-4">
            <Button asChild>
              <Link href="/register">Créer un compte</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">Nous contacter</Link>
            </Button>
          </div>
        </motion.article>
      </section>
    </main>
  );
}
