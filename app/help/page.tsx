"use client";

import type { Metadata } from "next";
import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-shell";

export default function HelpPage() {
  return (
    <main>
      <PageHero
        eyebrow="Support"
        title="Help center"
        subtitle="Quick answers to common platform, onboarding, and policy questions."
      />

      <section className="mx-auto -mt-16 max-w-3xl px-4 pb-24">
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="neumorph prose prose-sm max-w-none space-y-5 p-8 text-foreground/80 md:p-12
            [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-3
            [&_ul]:list-disc [&_ul]:space-y-3 [&_ul]:pl-5 [&_li]:text-sm"
        >
          <h2>Frequently asked questions</h2>
          <ul>
            <li>
              <strong className="text-foreground">
                Who can invest on Zeller?
              </strong>
              <br />
              Zeller currently supports accredited investors, with identity
              checks completed during onboarding and before funding.
            </li>
            <li>
              <strong className="text-foreground">
                How long does setup take?
              </strong>
              <br />
              Creating an account usually takes minutes. Verification review is
              typically completed within one business day.
            </li>
            <li>
              <strong className="text-foreground">
                Can I skip KYC at onboarding?
              </strong>
              <br />
              Yes. You can defer KYC and complete it later from Verification in
              your profile menu (or /kyc) before your first investment.
            </li>
            <li>
              <strong className="text-foreground">
                Where do I see transactions?
              </strong>
              <br />
              Use your dashboard transaction and investment pages for status,
              history, and payout records.
            </li>
            <li>
              <strong className="text-foreground">
                Are returns guaranteed?
              </strong>
              <br />
              No. All investments carry risk, including possible loss of
              principal.
            </li>
            <li>
              <strong className="text-foreground">
                Where can I read legal terms?
              </strong>
              <br />
              Review our{" "}
              <Link
                href="/terms-of-service"
                className="font-medium text-foreground underline underline-offset-4"
              >
                Terms of Service
              </Link>
              ,{" "}
              <Link
                href="/privacy-policy"
                className="font-medium text-foreground underline underline-offset-4"
              >
                Privacy Policy
              </Link>
              , and{" "}
              <Link
                href="/cookie-policy"
                className="font-medium text-foreground underline underline-offset-4"
              >
                Cookie Policy
              </Link>
              .
            </li>
          </ul>
          <h2>Need more help?</h2>
          <p>
            Our team can help with onboarding, account, and product questions.
          </p>
          <div className="pt-2">
            <Button asChild>
              <Link href="/contact">Contact support</Link>
            </Button>
          </div>
        </motion.article>
      </section>
    </main>
  );
}
