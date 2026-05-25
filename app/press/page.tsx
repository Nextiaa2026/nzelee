"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { PageHero } from "@/components/page-shell";

export default function PressPage() {
  return (
    <main>
      <PageHero
        eyebrow="Presse"
        title="Médias & presse"
        subtitle="Le kit média et les annonces seront publiés ici. Pour toute demande presse, utilisez le formulaire de contact."
      />

      <section className="mx-auto -mt-16 max-w-3xl px-4 pb-24">
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="neumorph prose prose-sm max-w-none space-y-5 p-8 text-foreground/80 md:p-12
            [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-3
            [&_p]:my-3 [&_p]:leading-relaxed"
        >
          <h2>Contact presse</h2>
          <p>
            Envoyez votre demande via notre{" "}
            <Link
              href="/contact"
              className="font-medium text-foreground underline underline-offset-4"
            >
              page de contact
            </Link>{" "}
            en indiquant « Presse » dans l&apos;objet.
          </p>
          <h2>Marque</h2>
          <p>
            Le logo et les directives de marque peuvent être partagés sur demande
            une fois une relation presse formalisée.
          </p>
        </motion.article>
      </section>
    </main>
  );
}
