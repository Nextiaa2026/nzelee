"use client";

import type { Metadata } from "next";
import { motion } from "framer-motion";

import { PageHero } from "@/components/page-shell";
import { ContactForm } from "@/components/forms/contact-form";

const CHANNELS = [
  { t: "Support", d: "Account, app, transactions", v: "support@zeller.app" },
  { t: "Investors", d: "Tier upgrades, advisor calls", v: "invest@zeller.app" },
  { t: "Press & partnerships", d: "Media kit, collabs", v: "press@zeller.app" },
];

export default function ContactPage() {
  return (
    <main>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Let&apos;s <span className="text-mint">talk.</span>
          </>
        }
        subtitle="Whether you're sizing up your first investment or scaling a $10M portfolio — our team is here for you."
      />

      <section className="mx-auto -mt-16 max-w-6xl px-4 pb-24">
        <div className="grid gap-6 md:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4 md:col-span-2"
          >
            {CHANNELS.map((c) => (
              <div key={c.t} className="neumorph-pop p-5">
                <p className="text-xs uppercase tracking-widest text-deep-green">
                  {c.t}
                </p>
                <p className="font-display mt-2 text-xl">{c.v}</p>
                <p className="text-xs text-foreground/55">{c.d}</p>
              </div>
            ))}
            <div className="rounded-3xl bg-deep-green p-6 text-deep-green-foreground">
              <p className="font-display text-2xl">HQ</p>
              <p className="mt-2 text-sm opacity-80">
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
            className="neumorph space-y-5 p-8 md:col-span-3"
          >
            <h2 className="font-display text-3xl">Send us a message</h2>
            <p className="text-sm text-foreground/60">
              For legal notices related to the Terms or Privacy Policy, include
              &quot;Legal&quot; in the subject line.
            </p>
            <ContactForm />
          </motion.div>
        </div>
      </section>
    </main>
  );
}
