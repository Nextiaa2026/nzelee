"use client";

import { motion } from "framer-motion";

import { PageHero } from "@/components/page-shell";
import { extensionBodyTextClass } from "@/components/extension-page-parts";
import { cn } from "@/lib/utils";

interface LegalSection {
  id: string;
  title: string;
  body: React.ReactNode;
}

export function LegalPage({
  eyebrow,
  title,
  updatedAt,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  updatedAt: string;
  intro: React.ReactNode;
  sections: LegalSection[];
}) {
  return (
    <div className="min-h-svh bg-background">
      <PageHero
        eyebrow={eyebrow}
        title={title}
        subtitle={`Last updated ${updatedAt}`}
      />

      <div className="mx-auto -mt-16 max-w-6xl space-y-6 px-4 pb-24">
        {intro ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="neumorph p-6 text-sm leading-relaxed text-foreground/80 md:p-8"
          >
            {intro}
          </motion.div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="neumorph lg:sticky lg:top-24 lg:p-6"
            >
              <div className="text-xs font-bold uppercase tracking-widest text-foreground/50">
                On this page
              </div>
              <ol className="mt-4 space-y-2.5 text-sm">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="flex gap-2 text-foreground/65 transition-colors hover:text-foreground"
                    >
                      <span className="font-mono tabular-nums text-foreground/35">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{s.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </motion.div>
          </aside>

          <article className="space-y-5 lg:col-span-8">
            {sections.map((s, i) => (
              <motion.div
                key={s.id}
                id={s.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="neumorph scroll-mt-24 p-6 md:p-8"
              >
                <div className="text-xs font-bold uppercase tracking-widest text-deep-green">
                  Section {String(i + 1).padStart(2, "0")}
                </div>
                <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground">
                  {s.title}
                </h2>
                <div className={cn("mt-4 space-y-4", extensionBodyTextClass)}>
                  {s.body}
                </div>
              </motion.div>
            ))}
          </article>
        </div>
      </div>
    </div>
  );
}
