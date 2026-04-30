"use client";

import type { Metadata } from "next";
import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-shell";

export default function ServicesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Services"
        title="What we offer"
        subtitle="Platform capabilities for discovery, diligence, and ongoing portfolio management."
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
          <h2>For investors</h2>
          <ul>
            <li>Structured listings and transparent fee schedules</li>
            <li>Dashboards for commitments, transactions, and withdrawals</li>
            <li>Identity and eligibility workflows where required</li>
          </ul>
          <h2>For administrators</h2>
          <ul>
            <li>Campaign and pledge management</li>
            <li>User administration and reporting</li>
          </ul>
          <div className="flex flex-wrap gap-3 pt-4">
            <Button asChild>
              <Link href="/register">Create an account</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">Talk to us</Link>
            </Button>
          </div>
        </motion.article>
      </section>
    </main>
  );
}
