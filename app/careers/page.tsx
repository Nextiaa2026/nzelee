"use client";

import type { Metadata } from "next";
import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-shell";

export default function CareersPage() {
  return (
    <main>
      <PageHero
        eyebrow="Careers"
        title={
          <>
            Join the <span className="text-mint">Zeller team</span>
          </>
        }
        subtitle="We are building tools for private-market investing. Roles will be posted here as we grow."
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
            There are no open roles listed at the moment. When we hire, you will
            find engineering, product, compliance, and operations positions on
            this page.
          </p>
          <p>
            In the meantime, you can reach us through{" "}
            <Link
              href="/contact"
              className="font-medium text-foreground underline underline-offset-4"
            >
              contact
            </Link>{" "}
            with a CV or portfolio link.
          </p>
          <div className="pt-4">
            <Button asChild variant="outline">
              <Link href="/contact">Get in touch</Link>
            </Button>
          </div>
        </motion.article>
      </section>
    </main>
  );
}
