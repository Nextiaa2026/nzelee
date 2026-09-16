"use client";

import { motion } from "framer-motion";

import { PageHero } from "@/components/page-shell";
import { ContactForm } from "@/components/forms/contact-form";
import { cn } from "@/lib/utils";

const infoCardClass =
  "rounded-2xl border border-deep-green/10 bg-white p-5 shadow-[0_8px_30px_-12px_rgba(5,45,29,0.14),0_2px_8px_-4px_rgba(5,45,29,0.06)] sm:p-6";

const CHANNELS = [
  { t: "Assistance", d: "Compte, app, transactions", v: "support@nzelee.com" },
  { t: "Investisseurs", d: "Mise à niveau, appels conseillers", v: "invest@nzelee.com" },
  { t: "Presse & partenariats", d: "Dossier de presse, collabs", v: "press@nzelee.com" },
];

export default function ContactPage() {
  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Parlons-<span className="text-mint">en.</span>
          </>
        }
        subtitle="Que vous prépariez votre premier investissement ou que vous développiez un portefeuille de 10M — notre équipe est là pour vous."
      />

      <section className="relative z-10 bg-white px-4 pb-24 pt-4 md:pt-6">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-5 md:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4 md:col-span-2"
          >
            {CHANNELS.map((c) => (
              <div key={c.t} className={infoCardClass}>
                <p className="text-[11px] font-bold uppercase tracking-widest text-deep-green/45">
                  {c.t}
                </p>
                <p className="mt-2 font-sans text-lg font-bold tracking-tight text-deep-green sm:text-xl">
                  {c.v}
                </p>
                <p className="mt-1 text-sm text-deep-green/55">{c.d}</p>
              </div>
            ))}
            <div className={cn(infoCardClass, "bg-deep-green text-deep-green-foreground")}>
              <p className="text-[11px] font-bold uppercase tracking-widest text-mint/80">
                HQ
              </p>
              <p className="mt-2 font-sans text-lg font-bold tracking-tight text-white sm:text-xl">
                Lisbon
              </p>
              <p className="mt-1 text-sm text-white/70">
                Av. da Liberdade 220
                <br />
                1250-147 Lisbon, Portugal
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-5 md:col-span-3"
          >
            <header className="space-y-2">
              <h2 className="font-sans text-3xl font-light tracking-tight text-deep-green">
                Envoyez-nous un message
              </h2>
              <p className="text-sm text-deep-green/60">
                Pour les avis juridiques liés aux conditions ou à la politique de
                confidentialité, incluez &quot;Légal&quot; dans la ligne
                d&apos;objet.
              </p>
            </header>
            <ContactForm />
          </motion.div>
        </div>
      </section>
    </main>
  );
}
