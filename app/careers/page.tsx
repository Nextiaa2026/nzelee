"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-shell";

export default function CareersPage() {
  return (
    <main>
      <PageHero
        eyebrow="Carrières"
        title={
          <>
            Rejoignez l&apos;équipe{" "}
            <span className="text-mint">Nzelee</span>
          </>
        }
        subtitle="Nous construisons des outils pour l'investissement sur les marchés privés. Les postes seront publiés ici au fil de notre croissance."
      />

      <section className="mx-auto -mt-16 max-w-3xl px-4 pb-24">
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="neumorph space-y-5 p-8 text-foreground/80 md:p-12"
        >
          <p>
            Aucun poste n&apos;est ouvert pour le moment. Lorsque nous
            recruterons, vous trouverez ici des offres en ingénierie, produit,
            conformité et opérations.
          </p>
          <p>
            En attendant, contactez-nous via la page{" "}
            <Link
              href="/contact"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Contact
            </Link>{" "}
            avec un CV ou un lien portfolio.
          </p>
          <div className="pt-4">
            <Button asChild variant="outline">
              <Link href="/contact">Nous écrire</Link>
            </Button>
          </div>
        </motion.article>
      </section>
    </main>
  );
}
