"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

import { PageHero } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { landingImages } from "@/lib/landing-images";
import { httpClient } from "@/lib/http/client";

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

interface PlatformStats {
  totalCampaigns: number;
  totalInvestors: number;
  totalRaised: number;
  activeCampaigns: number;
  averageRating: number;
  totalReviews: number;
  minInvestment: number;
  maxInvestment: number;
}

async function fetchPlatformStats(): Promise<PlatformStats> {
  const response = await httpClient.get("/public/platform-stats");
  return response.data;
}

export function AboutPageClient() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["platform-stats"],
    queryFn: fetchPlatformStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Format the stats for display
  const formattedStats = stats
    ? [
        {
          v: `${(stats.totalRaised / 100 / 1000000).toFixed(1)}M XAF`,
          l: "Assets invested",
        },
        {
          v: `${(stats.totalInvestors / 1000).toFixed(0)}k+`,
          l: "Active investors",
        },
        { v: stats.activeCampaigns.toString(), l: "Active campaigns" },
        { v: `${stats.averageRating.toFixed(1)}★`, l: "Average rating" },
      ]
    : [
        { v: "...", l: "Assets invested" },
        { v: "...", l: "Active investors" },
        { v: "...", l: "Active campaigns" },
        { v: "...", l: "Average rating" },
      ];

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
        subtitle="We started Nzelle to tear down the walls between people and the markets — making serious investing feel as simple as sending a text."
      />

      <section className="mx-auto -mt-16 max-w-6xl px-4">
        <div className="grid gap-4 md:grid-cols-4">
          {formattedStats.map((s, i) => (
            <motion.div
              key={s.l}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="overflow-hidden rounded-3xl border border-foreground/10 bg-surface p-6 text-center transition-transform hover:-translate-y-2"
            >
              <p
                className={`font-display text-4xl text-deep-green ${isLoading ? "animate-pulse" : ""}`}
              >
                {s.v}
              </p>
              <p className="mt-1 text-xs uppercase tracking-widest text-foreground/50">
                {s.l}
              </p>
            </motion.div>
          ))}
        </div>
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
              built Nzelle to flip that script — pooling capital, slashing fees,
              and bringing institutional-grade investments to anyone with a
              phone.
            </p>
            <p className="mt-3 text-foreground/70">
              Today, hundreds of thousands of investors trust Nzelle to grow
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
