"use client";

import type { Metadata } from "next";
import Link from "next/link";
import { motion } from "framer-motion";

import { PageHero } from "@/components/page-shell";

export default function PressPage() {
  return (
    <main>
      <PageHero
        eyebrow="Press"
        title="Media & Press"
        subtitle="Media kit and announcements will appear here. For press inquiries, use the contact form."
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
          <h2>Media contact</h2>
          <p>
            Please email your request through our{" "}
            <Link
              href="/contact"
              className="font-medium text-foreground underline underline-offset-4"
            >
              contact page
            </Link>{" "}
            and include &quot;Press&quot; in the subject line.
          </p>
          <h2>Brand</h2>
          <p>
            Logo and brand guidelines can be shared on request once a formal
            press relationship is established.
          </p>
        </motion.article>
      </section>
    </main>
  );
}
