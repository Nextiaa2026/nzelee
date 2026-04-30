"use client";

import type { Metadata } from "next";
import Link from "next/link";
import { motion } from "framer-motion";

import { PageHero } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { landingImages } from "@/lib/landing-images";

const STATS = [
  { v: "$2.4B", l: "Assets invested" },
  { v: "180k+", l: "Active investors" },
  { v: "24", l: "Countries served" },
  { v: "4.9★", l: "App store rating" },
];

const VALUES = [
  {
    t: "Transparency",
    d: "No hidden fees. Every cost, risk, and return shown upfront — always.",
  },
  {
    t: "Accessibility",
    d: "Start with $10. We believe wealth-building should never depend on a minimum balance.",
  },
  {
    t: "Long-term thinking",
    d: "We optimize for decades, not days. Our tools nudge you toward compounding wins.",
  },
];

export default function AboutPage() {
  return (
    <main>
      <PageHero
        eyebrow="About us"
        title={
          <>
            Building the future of{" "}
            <span className="text-mint">everyday investing</span>
          </>
        }
        subtitle="We started Zeller to tear down the walls between people and the markets — making serious investing feel as simple as sending a text."
      />

      <section className="mx-auto -mt-16 max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid gap-4 rounded-3xl border border-foreground/10 bg-surface p-6 md:grid-cols-4"
        >
          {STATS.map((s) => (
            <div key={s.l} className="text-center">
              <p className="font-display text-4xl text-deep-green">{s.v}</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-foreground/50">
                {s.l}
              </p>
            </div>
          ))}
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-24">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <motion.img
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            src={landingImages.deskFlatlay}
            alt="Our workspace"
            className="h-[420px] w-full rounded-3xl object-cover"
          />
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs uppercase tracking-widest text-deep-green">
              Our story
            </p>
            <h2 className="font-display mt-3 text-4xl">
              From a kitchen table to a movement.
            </h2>
            <p className="mt-5 text-foreground/70">
              In 2021, our founders watched friends and family struggle to
              access the same opportunities institutions enjoyed every day. We
              built Zeller to flip that script — pooling capital, slashing fees,
              and bringing institutional-grade investments to anyone with a
              phone.
            </p>
            <p className="mt-3 text-foreground/70">
              Today, hundreds of thousands of investors trust Zeller to grow
              their wealth across stocks, ETFs, crypto, and tokenized real
              estate.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-surface-muted py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-center text-4xl">
            What we stand for
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.t}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="neumorph-pop p-7"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mint/30 font-display text-deep-green">
                  {i + 1}
                </div>
                <h3 className="font-display mt-4 text-2xl">{v.t}</h3>
                <p className="mt-2 text-sm text-foreground/65">{v.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-24">
        <h2 className="font-display text-center text-4xl">Explore</h2>
        <p className="mt-3 text-center text-foreground/60">
          See live listings on the campaigns directory, or open your dashboard
          after sign-in.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/campaigns">View campaigns</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/register">Register</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/login">Log in</Link>
          </Button>
        </div>
        <p className="mt-6 text-center text-sm text-foreground/50">
          <Link href="/terms-of-service" className="hover:text-foreground">
            Terms of Service
          </Link>
          {" · "}
          <Link href="/privacy-policy" className="hover:text-foreground">
            Privacy Policy
          </Link>
        </p>
      </section>
    </main>
  );
}
