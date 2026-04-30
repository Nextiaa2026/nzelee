"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Marketing / doc hero: animated glow orbs + headline (site nav/footer come from {@link GlobalSiteChrome}).
 */
export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-deep-green pb-20 pt-6 text-deep-green-foreground">
      <motion.div
        className="pointer-events-none absolute -left-20 top-20 h-[500px] w-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.78 0.16 145 / 0.35), transparent 70%)",
        }}
        animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -right-32 top-40 h-[600px] w-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.78 0.16 145 / 0.25), transparent 70%)",
        }}
        animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative mx-auto mt-12 max-w-4xl px-4 text-center">
        {eyebrow ? (
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block rounded-full border border-mint/30 bg-deep-green/40 px-3 py-1 text-xs uppercase tracking-widest text-mint"
          >
            {eyebrow}
          </motion.span>
        ) : null}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-display mt-4 text-4xl leading-[1.05] text-glow md:text-5xl"
        >
          {title}
        </motion.h1>
        {subtitle ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mx-auto mt-4 max-w-2xl text-sm text-deep-green-foreground/75 md:text-base"
          >
            {subtitle}
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}

/** Single-column legal-style body overlapping the hero (new design aesthetic). */
export function LegalLayout({
  eyebrow = "Legal",
  title,
  updated,
  children,
}: {
  eyebrow?: string;
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main className="bg-background">
      <PageHero
        eyebrow={eyebrow}
        title={title}
        subtitle={`Last updated ${updated}`}
      />
      <section className="mx-auto -mt-16 max-w-3xl px-4 pb-24">
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="neumorph prose prose-sm max-w-none p-8 text-foreground/80 md:p-12
            [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-3
            [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:mb-2
            [&_p]:my-3 [&_p]:leading-relaxed
            [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_li]:text-sm"
        >
          {children}
        </motion.article>
      </section>
    </main>
  );
}
