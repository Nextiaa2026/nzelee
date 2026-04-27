"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { PropertiesShowcase } from "@/components/landing/properties-showcase";
import { landingImages } from "@/lib/landing-images";

const Blank = () => <span className="underline-blank" />;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const stagger = {
  show: { transition: { staggerChildren: 0.08 } },
};

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-hero-bg pt-6 pb-32 text-deep-green-foreground"
    >
      {/* Animated glow blobs */}
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

      <div className="relative mx-auto max-w-6xl px-4">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="mt-14 text-center md:mt-20"
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-deep-green-foreground/20 bg-deep-green/40 px-4 py-1.5 text-xs backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-mint pulse" />
            Invest. Grow. Repeat.
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="mt-6 font-display text-5xl leading-[0.98] tracking-tight sm:text-6xl md:text-8xl"
          >
            Say hello to{" "}
            <span className="inline-flex -translate-y-2 items-center gap-3 rounded-full bg-mint px-5 py-2 text-deep-green">
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                💰
              </motion.span>
              smarter
            </span>
            <br />
            investing for everyone
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-8 max-w-md text-base text-deep-green-foreground/70"
          >
            Build a portfolio in minutes. Trade stocks, ETFs, crypto and
            real-world properties — all from one beautifully simple app.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap justify-center gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-full bg-mint px-7 py-3.5 text-sm font-medium text-deep-green"
            >
              Start investing
            </motion.button>
            <motion.a
              href="#properties"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-full border border-deep-green-foreground/25 bg-deep-green/30 px-7 py-3.5 text-sm font-medium text-deep-green-foreground backdrop-blur"
            >
              Browse properties
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Hero image with parallax */}
        <motion.div
          style={{ y, scale }}
          className="relative mt-20 flex justify-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-3xl bg-mint/10 p-4 backdrop-blur ring-1 ring-deep-green-foreground/10"
          >
            <img
              src={landingImages.heroMoney}
              alt="Investor holding cash earnings"
              width={420}
              height={520}
              className="h-[500px] w-full max-w-sm rounded-2xl object-cover"
            />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-12 top-12 hidden gap-3 rounded-2xl bg-surface px-5 py-4 shadow-2xl md:flex"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint text-deep-green">
                ↑
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-foreground/50">
                  Portfolio
                </div>
                <div className="font-display text-xl text-foreground">
                  +24.6%
                </div>
              </div>
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-14 bottom-20 hidden rounded-2xl bg-surface px-5 py-4 shadow-2xl md:block"
            >
              <div className="text-[10px] uppercase tracking-wider text-foreground/50">
                TSLA
              </div>
              <div className="font-display text-xl text-foreground">
                $248.50
              </div>
              <div className="text-xs text-mint-foreground">+3.21%</div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function Benefits() {
  const items = [
    {
      color: "bg-deep-green text-deep-green-foreground",
      title: "Zero commissions",
      body: "Trade stocks, ETFs and crypto with no hidden fees.",
    },
    {
      color: "bg-mint text-deep-green",
      title: "Smart portfolios",
      body: "AI-powered allocations tailored to your risk profile.",
    },
    {
      color: "bg-foreground text-background",
      title: "Bank-grade security",
      body: "Your assets protected with multi-layer encryption.",
    },
    {
      color: "bg-amber-200",
      title: "Real-time markets",
      body: "Lightning-fast execution across global exchanges.",
    },
  ];
  return (
    <Section className="bg-background py-24">
      <div className="mx-auto max-w-6xl px-4" id="features">
        <motion.p
          variants={fadeUp}
          className="text-center text-xs uppercase tracking-widest text-foreground/50"
        >
          Benefits
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="mx-auto mt-4 max-w-2xl text-center font-display text-4xl leading-tight sm:text-5xl"
        >
          Why investors choose <Blank /> us
        </motion.h2>
        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <motion.div
              key={it.title}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div
                className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${it.color}`}
              >
                <div className="h-5 w-5 rounded-sm bg-current opacity-80" />
              </div>
              <h3 className="text-base font-semibold">{it.title}</h3>
              <p className="mt-2 text-sm text-foreground/60">{it.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function Integrations() {
  return (
    <Section className="bg-background pb-24">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-2 md:items-center">
        <motion.img
          variants={fadeUp}
          src={landingImages.integrationsWoman}
          alt="Investor checking her portfolio on the go"
          loading="lazy"
          width={800}
          height={640}
          className="h-[420px] w-full rounded-3xl object-cover"
        />
        <motion.div variants={fadeUp}>
          <p className="text-xs uppercase tracking-widest text-foreground/50">
            Integrated
          </p>
          <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
            Connect every account for a complete <Blank /> wealth view
          </h2>
          <p className="mt-5 max-w-md text-foreground/60">
            Link your brokerages, retirement accounts and crypto wallets to see
            your entire net worth grow in one beautiful dashboard.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="mt-8 rounded-full bg-deep-green px-6 py-3 text-sm font-medium text-deep-green-foreground"
          >
            Get the app
          </motion.button>
        </motion.div>
      </div>
    </Section>
  );
}

function Gallery() {
  return (
    <Section className="bg-background pb-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-4 md:grid-cols-3">
          <motion.div variants={fadeUp} className="md:row-span-2">
            <img
              src={landingImages.deskFlatlay}
              alt="Investor's desk with stock market chart on tablet"
              loading="lazy"
              width={1024}
              height={768}
              className="h-full min-h-[420px] w-full rounded-3xl object-cover"
            />
          </motion.div>
          <motion.div
            variants={fadeUp}
            className="rounded-3xl bg-deep-green p-8 text-deep-green-foreground"
          >
            <p className="text-xs uppercase tracking-widest opacity-70">
              Community
            </p>
            <h3 className="mt-3 font-display text-3xl leading-tight">
              Join 200k+ investors building wealth together
            </h3>
            <Link
              href="/investors"
              className="mt-6 inline-block rounded-full bg-mint px-5 py-2.5 text-xs font-medium text-deep-green"
            >
              See top investors →
            </Link>
          </motion.div>
          <motion.div variants={fadeUp}>
            <img
              src={landingImages.investorsTeam}
              alt="Team of investors collaborating"
              loading="lazy"
              width={1024}
              height={768}
              className="h-full min-h-[200px] w-full rounded-3xl object-cover"
            />
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

function FeatureCards() {
  return (
    <Section className="bg-surface-muted py-24">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div variants={fadeUp} className="text-center">
          <span className="inline-block rounded-full border border-foreground/15 bg-surface px-4 py-1.5 text-xs text-foreground/70">
            Features
          </span>
          <h2 className="mx-auto mt-6 max-w-3xl font-display text-4xl leading-[1.1] tracking-tight sm:text-5xl">
            Investing made simple, smart, and rewarding.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-foreground/60">
            Empowering you to grow your wealth with flexible, reliable, and
            stress-free investing tools.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 md:grid-cols-6">
          <motion.article
            variants={fadeUp}
            whileHover={{ y: -5 }}
            className="md:col-span-2 rounded-3xl border border-foreground/10 bg-surface p-6 [background-image:radial-gradient(circle,oklch(0_0_0/0.05)_1px,transparent_1px)] [background-size:18px_18px]"
          >
            <div className="flex h-44 items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl bg-surface px-6 py-5 text-center shadow-[0_10px_40px_-15px_rgba(0,0,0,0.15)]"
              >
                <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-mint text-deep-green">
                  ✓
                </div>
                <div className="text-[11px] text-foreground/50">
                  Trade executed
                </div>
                <div className="font-display text-2xl">$1,200</div>
              </motion.div>
            </div>
            <h3 className="mt-6 text-base font-semibold">Instant trades</h3>
            <p className="mt-2 text-sm text-foreground/60">
              Execute trades in seconds — because in markets, time is money.
            </p>
          </motion.article>

          <motion.article
            variants={fadeUp}
            whileHover={{ y: -5 }}
            className="md:col-span-2 rounded-3xl border border-foreground/10 bg-surface p-6 [background-image:radial-gradient(circle,oklch(0_0_0/0.05)_1px,transparent_1px)] [background-size:18px_18px]"
          >
            <div className="flex h-44 flex-col items-center justify-center gap-5">
              <div className="rounded-xl bg-surface px-4 py-2 text-sm font-semibold shadow-[0_8px_30px_-10px_rgba(0,0,0,0.15)]">
                $1,200
              </div>
              <div className="relative w-full">
                <div className="h-1.5 w-full rounded-full bg-foreground/10" />
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "66%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute left-0 top-0 h-1.5 rounded-full bg-deep-green"
                />
                <motion.div
                  initial={{ left: 0 }}
                  whileInView={{ left: "64%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-4 border-surface bg-deep-green shadow"
                />
              </div>
              <span className="rounded-full bg-mint px-3 py-1 text-[11px] font-medium text-deep-green">
                ● Your goal
              </span>
            </div>
            <h3 className="mt-6 text-base font-semibold">Competitive fees</h3>
            <p className="mt-2 text-sm text-foreground/60">
              Low, transparent pricing designed to fit your strategy and grow
              your gains.
            </p>
          </motion.article>

          <motion.article
            variants={fadeUp}
            whileHover={{ y: -5 }}
            className="md:col-span-2 rounded-3xl border border-foreground/10 bg-surface p-6 [background-image:radial-gradient(circle,oklch(0_0_0/0.05)_1px,transparent_1px)] [background-size:18px_18px]"
          >
            <div className="relative flex h-44 items-center justify-center">
              <motion.div
                animate={{ rotate: [-8, -12, -8] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -left-2 top-4 h-24 w-20 rounded-lg bg-surface p-2 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.18)]"
              >
                <div className="space-y-1.5">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-1 w-full rounded-full bg-foreground/15"
                    />
                  ))}
                </div>
                <span className="mt-2 inline-block rounded-full bg-foreground/10 px-2 py-0.5 text-[8px]">
                  Term
                </span>
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-mint text-deep-green shadow-[0_10px_30px_-5px_oklch(0.78_0.16_145/0.6)]"
              >
                <span className="text-2xl">✓</span>
              </motion.div>
              <motion.div
                animate={{ rotate: [8, 12, 8] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute -right-2 bottom-4 h-24 w-20 rounded-lg bg-surface p-2 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.18)]"
              >
                <div className="space-y-1.5">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-1 w-full rounded-full bg-foreground/15"
                    />
                  ))}
                </div>
                <span className="mt-2 inline-block rounded-full bg-foreground/10 px-2 py-0.5 text-[8px]">
                  Term
                </span>
              </motion.div>
            </div>
            <h3 className="mt-6 text-base font-semibold">Transparent terms</h3>
            <p className="mt-2 text-sm text-foreground/60">
              No hidden fees, no surprises. Understand exactly what you own from
              day one.
            </p>
          </motion.article>

          <motion.article
            variants={fadeUp}
            whileHover={{ y: -5 }}
            className="md:col-span-3 rounded-3xl border border-foreground/10 bg-surface p-6 [background-image:radial-gradient(circle,oklch(0_0_0/0.05)_1px,transparent_1px)] [background-size:18px_18px]"
          >
            <div className="flex h-44 items-center">
              <div className="relative w-full">
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs">
                  <span>🎯</span> Your goals
                </span>
                <div className="ml-6 mt-3 inline-flex flex-col gap-2">
                  {["Stocks & ETFs", "Crypto basket", "Retirement IRA"].map(
                    (p, i) => (
                      <motion.div
                        key={p}
                        initial={{ x: -20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.15 }}
                        className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${i === 1 ? "border-deep-green bg-mint/30 font-medium" : "border-foreground/10 bg-surface"}`}
                      >
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-deep-green text-[10px] text-deep-green-foreground">
                          ✓
                        </span>
                        {p}
                      </motion.div>
                    ),
                  )}
                </div>
                <span className="absolute right-0 top-12 rounded-full border border-foreground/10 bg-surface px-3 py-1.5 text-xs">
                  Auto-invest →
                </span>
              </div>
            </div>
            <h3 className="mt-6 text-base font-semibold">
              Flexible portfolios
            </h3>
            <p className="mt-2 max-w-md text-sm text-foreground/60">
              Choose from personalized strategies tailored to your goals —
              whether income, growth, or long-term retirement planning.
            </p>
          </motion.article>

          <motion.article
            variants={fadeUp}
            whileHover={{ y: -5 }}
            className="md:col-span-3 rounded-3xl border border-foreground/10 bg-surface p-6 [background-image:radial-gradient(circle,oklch(0_0_0/0.05)_1px,transparent_1px)] [background-size:18px_18px]"
          >
            <div className="flex h-44 items-center justify-center gap-4">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface text-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.2)]"
              >
                ✉️
              </motion.div>
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.3,
                }}
                className="flex h-20 w-20 items-center justify-center rounded-3xl bg-mint text-3xl text-deep-green shadow-[0_15px_40px_-10px_oklch(0.78_0.16_145/0.6)]"
              >
                🎧
              </motion.div>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.6,
                }}
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface text-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.2)]"
              >
                💬
              </motion.div>
            </div>
            <h3 className="mt-6 text-base font-semibold">24/7 support</h3>
            <p className="mt-2 text-sm text-foreground/60">
              Our dedicated team is here to guide you at every step, anytime you
              need us.
            </p>
          </motion.article>
        </div>
      </div>
    </Section>
  );
}

function GettingStarted() {
  const steps = [
    "Download the App",
    "Sign up and create your account",
    "Start investing",
  ];
  return (
    <Section className="bg-background py-24">
      <div className="mx-auto max-w-6xl px-4">
        <motion.p
          variants={fadeUp}
          className="text-center text-xs uppercase tracking-widest text-foreground/50"
        >
          How it works
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="mx-auto mt-4 max-w-3xl text-center font-display text-4xl leading-tight sm:text-5xl"
        >
          Getting started is <br /> <Blank /> simple
        </motion.h2>
        <motion.div
          variants={fadeUp}
          className="mt-14 grid gap-6 rounded-3xl bg-surface-muted p-8 md:grid-cols-2 md:items-center"
        >
          <div className="flex justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="flex h-44 w-44 items-center justify-center rounded-3xl bg-mint"
            >
              <div className="grid grid-cols-3 gap-1.5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="h-5 w-5 rounded-full bg-deep-green" />
                ))}
              </div>
            </motion.div>
          </div>
          <ol className="space-y-5">
            {steps.map((s, i) => (
              <motion.li
                key={s}
                variants={fadeUp}
                className="flex items-start gap-4"
              >
                <span className="font-display text-2xl text-foreground/40">
                  {i + 1}.
                </span>
                <div>
                  <p className="font-semibold">{s}</p>
                  {i === 0 && (
                    <button className="mt-3 rounded-full bg-deep-green px-5 py-2 text-xs text-deep-green-foreground">
                      Get Started
                    </button>
                  )}
                </div>
              </motion.li>
            ))}
          </ol>
        </motion.div>
      </div>
    </Section>
  );
}

function Testimonials() {
  const quotes = [
    {
      name: "Jakob Baker",
      role: "Marketing Manager",
      text: "As someone who's always on the move, this app has become essential. Managing investments has never been smoother.",
    },
    {
      name: "Kaitlynn Carder",
      role: "Account Manager",
      text: "The 24/7 customer support is amazing! It has saved me a few late nights, and they're always thorough.",
    },
    {
      name: "Anika Dulhanty",
      role: "Freelance Writer",
      text: "I used to dread tax time — but FlowFin's reports gave me peace of mind.",
    },
    {
      name: "Adryen Vanessa",
      role: "Founder, Atelier",
      text: "Fast, reliable, and easy to use. Real-time alerts when my trades fill — exactly what I needed.",
    },
  ];
  return (
    <Section className="bg-background py-24">
      <div className="mx-auto max-w-6xl px-4">
        <motion.p
          variants={fadeUp}
          className="text-center text-xs uppercase tracking-widest text-foreground/50"
        >
          Testimonials
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="mx-auto mt-4 max-w-3xl text-center font-display text-4xl leading-tight sm:text-5xl"
        >
          What our <Blank /> users <br /> are saying
        </motion.h2>
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {quotes.map((q) => (
            <motion.div
              key={q.name}
              variants={fadeUp}
              whileHover={{ scale: 1.02 }}
              className="rounded-2xl bg-surface-muted p-6"
            >
              <p className="text-sm leading-relaxed text-foreground/80">
                &ldquo;{q.text}&rdquo;
              </p>
              <div className="mt-5 border-t border-foreground/10 pt-4">
                <p className="text-sm font-semibold">{q.name}</p>
                <p className="text-xs text-foreground/50">{q.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function FinalCTA() {
  return (
    <Section className="px-4 pb-16">
      <motion.div
        variants={fadeUp}
        className="mx-auto max-w-6xl rounded-3xl bg-deep-green p-12 text-center text-deep-green-foreground"
      >
        <p className="text-xs uppercase tracking-widest opacity-70">
          Get started
        </p>
        <h2 className="mx-auto mt-4 max-w-3xl font-display text-4xl leading-tight sm:text-5xl">
          Ready to grow <Blank /> your <br /> wealth?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm opacity-70">
          Download the app, sign up, and start investing in minutes.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="mt-8 rounded-full bg-mint px-7 py-3.5 text-sm font-medium text-deep-green"
        >
          Download App
        </motion.button>
      </motion.div>
    </Section>
  );
}

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Benefits />
      <Integrations />
      <Gallery />
      <PropertiesShowcase />
      <FeatureCards />
      <GettingStarted />
      <Testimonials />
      <FinalCTA />
    </main>
  );
}
