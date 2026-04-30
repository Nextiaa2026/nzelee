"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  type LucideIcon,
  ArrowRight,
  Check,
  CircleDot,
  FileText,
  FolderKanban,
  Headphones,
  LayoutDashboard,
  Mail,
  MessageCircle,
  Receipt,
  Target,
  Wallet,
} from "lucide-react";

import { CampaignsShowcase } from "@/components/landing/campaigns-showcase";
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

function HeroBento() {
  const card =
    "relative overflow-hidden rounded-2xl border border-deep-green-foreground/15 bg-deep-green/35 p-4 text-left text-deep-green-foreground shadow-sm backdrop-blur-md sm:p-5";

  return (
    <motion.div
      variants={fadeUp}
      className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-none"
    >
      <div className="grid auto-rows-[minmax(88px,auto)] grid-cols-2 gap-3 sm:gap-4">
        {/* Folder-style tab on tall card */}
        <div
          className={`${card} row-span-2 flex flex-col justify-between pt-8 sm:pt-9`}
        >
          <div
            className="absolute left-4 top-0 flex h-7 items-center rounded-b-lg bg-mint/90 px-3 text-[10px] font-semibold uppercase tracking-wider text-deep-green"
            aria-hidden
          >
            Portfolio
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-deep-green-foreground/60">
              Tous les comptes
            </p>
            <p className="mt-1 font-display text-3xl sm:text-4xl">+24.6%</p>
            <p className="mt-1 text-xs text-deep-green-foreground/70">
              Rendement pondéré, 12 derniers mois
            </p>
          </div>
          <div className="mt-4 flex items-end justify-between gap-2 border-t border-deep-green-foreground/10 pt-4">
            <div>
              <p className="text-[10px] uppercase text-deep-green-foreground/50">
                Valeur nette
              </p>
              <p className="font-display text-lg">$184,320</p>
            </div>
            <span className="rounded-full bg-mint/30 px-2.5 py-1 text-[10px] font-medium text-deep-green">
              En direct
            </span>
          </div>
        </div>

        <div className={`${card} flex flex-col justify-center`}>
          <p className="text-[10px] uppercase tracking-wider text-deep-green-foreground/55">
            Marchés
          </p>
          <p className="mt-1 font-display text-xl">TSLA</p>
          <p className="mt-0.5 text-sm text-mint">+3.21%</p>
          <p className="text-xs text-deep-green-foreground/65">$248.50</p>
        </div>

        <div className={`${card} flex flex-col justify-center`}>
          <p className="text-[10px] uppercase tracking-wider text-deep-green-foreground/55">
            Frais
          </p>
          <p className="mt-1 font-display text-xl">$0</p>
          <p className="text-xs text-deep-green-foreground/70">
            Commissions sur actions &amp; ETFs
          </p>
        </div>

        <div
          className={`${card} col-span-2 sm:flex sm:items-center sm:justify-between sm:gap-4`}
        >
          <div>
            <p className="text-[10px] uppercase tracking-wider text-deep-green-foreground/55">
              Une seule app
            </p>
            <p className="mt-1 font-display text-lg leading-snug sm:text-xl">
              Actions, ETFs, crypto &amp; campagnes d&apos;entreprises
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 sm:mt-0">
            {["Actions", "Crypto", "Campagnes"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-deep-green-foreground/20 bg-deep-green/50 px-2.5 py-1 text-[10px] font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className={`${card} col-span-2 grid gap-3 sm:grid-cols-2`}>
          <div className="rounded-xl bg-deep-green/50 p-3 ring-1 ring-deep-green-foreground/10">
            <p className="text-[10px] uppercase text-deep-green-foreground/55">
              Sécurité
            </p>
            <p className="mt-1 text-sm font-medium leading-snug">
              Chiffrement bancaire &amp; contrôles de garde
            </p>
          </div>
          <div className="rounded-xl bg-deep-green/50 p-3 ring-1 ring-deep-green-foreground/10">
            <p className="text-[10px] uppercase text-deep-green-foreground/55">
              Assistance
            </p>
            <p className="mt-1 text-sm font-medium leading-snug">
              Des humains, 24/7 quand vous avez besoin de réponses
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero-bg pb-20 pt-28 text-deep-green-foreground md:pb-28 md:pt-32 lg:pb-32 lg:pt-36">
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
          className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-2 lg:items-center lg:gap-14"
        >
          <motion.div variants={fadeUp} className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-deep-green-foreground/20 bg-deep-green/40 px-4 py-1.5 text-xs backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-mint pulse" />
              Investir. Grandir. Recommencer.
            </span>

            <h1 className="mt-6 font-display text-5xl leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
              Dites bonjour à{" "}
              <span className="inline-flex -translate-y-2 items-center gap-3 rounded-full bg-mint px-5 py-2 text-deep-green">
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="inline-flex"
                  aria-hidden
                >
                  <Wallet
                    className="size-7 shrink-0 sm:size-8"
                    strokeWidth={2}
                  />
                </motion.span>
                l&apos;investissement
              </span>
              <br />
              plus intelligent pour tous
            </h1>

            <p className="mx-auto mt-8 max-w-md text-base text-deep-green-foreground/70 lg:mx-0">
              Créez un portefeuille en quelques minutes. Changez des actions, ETFs, crypto et
              campagnes sélectionnées — le tout depuis une application magnifiquement simple.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-3 lg:justify-start">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-full bg-mint px-7 py-3.5 text-sm font-medium text-deep-green"
              >
                Commencer à investir
              </motion.button>
              <motion.a
                href="#campaigns"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-full border border-deep-green-foreground/25 bg-deep-green/30 px-7 py-3.5 text-sm font-medium text-deep-green-foreground backdrop-blur"
              >
                Parcourir les campagnes
              </motion.a>
            </div>
          </motion.div>

          <HeroBento />
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

const benefitsViewport = {
  once: true,
  amount: 0.28,
  margin: "0px 0px -48px 0px",
} as const;

const benefitsRowTop = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.04 },
  },
};

const benefitsRowBottom = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.06 },
  },
};

const benefitsCardFromAbove = {
  hidden: { opacity: 0, y: -52 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const benefitsCardFromBelow = {
  hidden: { opacity: 0, y: 56 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function Benefits() {
  const items: {
    Icon: LucideIcon;
    surface: string;
    iconWrap: string;
    title: string;
    body: string;
  }[] = [
    {
      Icon: FileText,
      surface: "bg-deep-green text-deep-green-foreground",
      iconWrap:
        "bg-deep-green-foreground/15 ring-1 ring-deep-green-foreground/20",
      title: "Conditions de campagne claires",
      body: "Les objectifs, les délais et les risques sont détaillés sur chaque annonce afin que vous sachiez ce que vous soutenez.",
    },
    {
      Icon: Receipt,
      surface: "bg-mint text-deep-green",
      iconWrap: "bg-deep-green/15 ring-1 ring-deep-green/25",
      title: "Frais & minimums transparents",
      body: "Les frais et les montants minimums sont affichés avant votre engagement pour éviter toute surprise lors du paiement.",
    },
    {
      Icon: FolderKanban,
      surface: "bg-foreground text-background",
      iconWrap: "bg-background/15 ring-1 ring-background/25",
      title: "Listes de projets sélectionnées",
      body: "Comparez les campagnes par secteur, stade et taille de ticket pour trouver des projets qui correspondent à votre plan.",
    },
    {
      Icon: LayoutDashboard,
      surface: "bg-amber-200 text-foreground",
      iconWrap: "bg-foreground/10 ring-1 ring-foreground/15",
      title: "Un tableau de bord investisseur unique",
      body: "Suivez vos engagements, les mises à jour des campagnes et vos retraits en un seul endroit.",
    },
  ];

  return (
    <Section className="bg-background py-24">
      <div className="mx-auto max-w-6xl px-4" id="features">
        <motion.p
          variants={fadeUp}
          className="text-center text-xs uppercase tracking-widest text-foreground/50"
        >
          Avantages
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="mx-auto mt-4 max-w-2xl text-center font-display text-4xl leading-tight sm:text-5xl"
        >
          Pourquoi les investisseurs nous choisissent <Blank />
        </motion.h2>

        <div className="mx-auto mt-16 max-w-5xl space-y-8 sm:space-y-12">
          {/* First pair: shifted left — reads as the upper “step” of the zig-zag */}
          <motion.div
            className="grid gap-6 sm:grid-cols-2 sm:gap-8 sm:-translate-x-2 md:-translate-x-8 lg:-translate-x-14"
            initial="hidden"
            whileInView="visible"
            viewport={benefitsViewport}
            variants={benefitsRowTop}
          >
            {items.slice(0, 2).map((it) => (
              <motion.div key={it.title} variants={benefitsCardFromAbove}>
                <div
                  className={`flex h-full min-h-[200px] flex-col rounded-2xl p-6 shadow-md ring-1 ring-black/5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg ${it.surface}`}
                >
                  <div
                    className={`mb-5 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${it.iconWrap}`}
                  >
                    <it.Icon
                      className="size-6 opacity-90"
                      strokeWidth={2}
                      aria-hidden
                    />
                  </div>
                  <h3 className="text-base font-semibold leading-snug">
                    {it.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed opacity-90">
                    {it.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Second pair: shifted right — completes the zig-zag */}
          <motion.div
            className="grid gap-6 sm:grid-cols-2 sm:gap-8 sm:translate-x-6 md:translate-x-14 lg:translate-x-24"
            initial="hidden"
            whileInView="visible"
            viewport={benefitsViewport}
            variants={benefitsRowBottom}
          >
            {items.slice(2, 4).map((it) => (
              <motion.div key={it.title} variants={benefitsCardFromBelow}>
                <div
                  className={`flex h-full min-h-[200px] flex-col rounded-2xl p-6 shadow-md ring-1 ring-black/5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg ${it.surface}`}
                >
                  <div
                    className={`mb-5 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${it.iconWrap}`}
                  >
                    <it.Icon
                      className="size-6 opacity-90"
                      strokeWidth={2}
                      aria-hidden
                    />
                  </div>
                  <h3 className="text-base font-semibold leading-snug">
                    {it.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed opacity-90">
                    {it.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
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
          alt="Investisseuse vérifiant son portefeuille"
          loading="lazy"
          width={800}
          height={640}
          className="h-[420px] w-full rounded-3xl object-cover"
        />
        <motion.div variants={fadeUp}>
          <p className="text-xs uppercase tracking-widest text-foreground/50">
            Intégré
          </p>
          <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
            Connectez chaque compte pour une vue complète de votre <Blank /> patrimoine
          </h2>
          <p className="mt-5 max-w-md text-foreground/60">
            Liez vos courtages, comptes de retraite et portefeuilles crypto pour voir
            votre valeur nette globale croître dans un magnifique tableau de bord.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex rounded-full bg-deep-green px-6 py-3 text-sm font-medium text-deep-green-foreground transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            Commencer
          </Link>
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
              Communauté
            </p>
            <h3 className="mt-3 font-display text-3xl leading-tight">
              Rejoignez plus de 200k investisseurs bâtissant leur patrimoine ensemble
            </h3>
            <Link
              href="/investors"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-mint px-5 py-2.5 text-xs font-medium text-deep-green"
            >
              Voir les meilleurs investisseurs
              <ArrowRight
                className="size-4 shrink-0"
                strokeWidth={2}
                aria-hidden
              />
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
            Fonctionnalités
          </span>
          <h2 className="mx-auto mt-6 max-w-3xl font-display text-4xl leading-[1.1] tracking-tight sm:text-5xl">
            L&apos;investissement rendu simple, intelligent et gratifiant.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-foreground/60">
            Vous donner les moyens de faire croître votre patrimoine avec des outils d&apos;investissement flexibles, fiables et sans stress.
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
                  <Check className="size-5" strokeWidth={2.5} aria-hidden />
                </div>
                <div className="text-[11px] text-foreground/50">
                  Transaction exécutée
                </div>
                <div className="font-display text-2xl">$1,200</div>
              </motion.div>
            </div>
            <h3 className="mt-6 text-base font-semibold">Transactions instantanées</h3>
            <p className="mt-2 text-sm text-foreground/60">
              Exécutez vos transactions en quelques secondes — car sur les marchés, le temps c&apos;est de l&apos;argent.
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
              <span className="inline-flex items-center gap-1.5 rounded-full bg-mint px-3 py-1 text-[11px] font-medium text-deep-green">
                <CircleDot
                  className="size-3.5 shrink-0"
                  strokeWidth={2}
                  aria-hidden
                />
                Votre objectif
              </span>
            </div>
            <h3 className="mt-6 text-base font-semibold">Frais compétitifs</h3>
            <p className="mt-2 text-sm text-foreground/60">
              Une tarification basse et transparente conçue pour s&apos;adapter à votre stratégie et maximiser vos gains.
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
                <Check className="size-8" strokeWidth={2.5} aria-hidden />
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
            <h3 className="mt-6 text-base font-semibold">Conditions transparentes</h3>
            <p className="mt-2 text-sm text-foreground/60">
              Pas de frais cachés, pas de surprises. Comprenez exactement ce que vous possédez dès le premier jour.
            </p>
          </motion.article>

          <motion.article
            variants={fadeUp}
            whileHover={{ y: -5 }}
            className="md:col-span-3 rounded-3xl border border-foreground/10 bg-surface p-6 [background-image:radial-gradient(circle,oklch(0_0_0/0.05)_1px,transparent_1px)] [background-size:18px_18px]"
          >
            <div className="flex h-44 items-center">
              <div className="relative w-full">
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs text-foreground">
                  <Target
                    className="size-4 shrink-0"
                    strokeWidth={2}
                    aria-hidden
                  />
                  Vos objectifs
                </span>
                <div className="ml-6 mt-3 inline-flex flex-col gap-2">
                  {["Actions & ETFs", "Panier Crypto", "Plan Retraite"].map(
                    (p, i) => (
                      <motion.div
                        key={p}
                        initial={{ x: -20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.15 }}
                        className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${i === 1 ? "border-deep-green bg-mint/30 font-medium" : "border-foreground/10 bg-surface"}`}
                      >
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-deep-green text-deep-green-foreground">
                          <Check
                            className="size-2.5"
                            strokeWidth={3}
                            aria-hidden
                          />
                        </span>
                        {p}
                      </motion.div>
                    ),
                  )}
                </div>
                <span className="absolute right-0 top-12 inline-flex items-center gap-1 rounded-full border border-foreground/10 bg-surface px-3 py-1.5 text-xs text-foreground">
                  Auto-investir
                  <ArrowRight
                    className="size-3.5 shrink-0"
                    strokeWidth={2}
                    aria-hidden
                  />
                </span>
              </div>
            </div>
            <h3 className="mt-6 text-base font-semibold">
              Portefeuilles flexibles
            </h3>
            <p className="mt-2 max-w-md text-sm text-foreground/60">
              Choisissez parmi des stratégies personnalisées adaptées à vos objectifs — qu&apos;il s&apos;agisse de revenus, de croissance ou de planification de retraite à long terme.
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
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface text-foreground shadow-[0_10px_30px_-10px_rgba(0,0,0,0.2)]"
              >
                <Mail className="size-6" strokeWidth={2} aria-hidden />
              </motion.div>
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.3,
                }}
                className="flex h-20 w-20 items-center justify-center rounded-3xl bg-mint text-deep-green shadow-[0_15px_40px_-10px_oklch(0.78_0.16_145/0.6)]"
              >
                <Headphones className="size-9" strokeWidth={2} aria-hidden />
              </motion.div>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.6,
                }}
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface text-foreground shadow-[0_10px_30px_-10px_rgba(0,0,0,0.2)]"
              >
                <MessageCircle className="size-6" strokeWidth={2} aria-hidden />
              </motion.div>
            </div>
            <h3 className="mt-6 text-base font-semibold">Assistance 24/7</h3>
            <p className="mt-2 text-sm text-foreground/60">
              Notre équipe dédiée est là pour vous guider à chaque étape, dès que vous en avez besoin.
            </p>
          </motion.article>
        </div>
      </div>
    </Section>
  );
}

function GettingStarted() {
  const steps = [
    "Commencez",
    "Inscrivez-vous et créez votre compte",
    "Commencez à investir",
  ];
  return (
    <Section className="bg-background py-24">
      <div className="mx-auto max-w-6xl px-4">
        <motion.p
          variants={fadeUp}
          className="text-center text-xs uppercase tracking-widest text-foreground/50"
        >
          Comment ça marche
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="mx-auto mt-4 max-w-3xl text-center font-display text-4xl leading-tight sm:text-5xl"
        >
          Commencer est <br /> <Blank /> simple
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
                    <Link
                      href="/register"
                      className="mt-3 inline-flex rounded-full bg-deep-green px-5 py-2 text-xs font-medium text-deep-green-foreground transition-opacity hover:opacity-90"
                    >
                      Commencer
                    </Link>
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

const TESTIMONIAL_HEADLINE_WORDS = [
  "précoces",
  "intelligents",
  "actifs",
  "dévoués",
  "réfléchis",
] as const;

function TestimonialsHeading() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setI((n) => (n + 1) % TESTIMONIAL_HEADLINE_WORDS.length);
    }, 2800);
    return () => window.clearInterval(id);
  }, []);

  return (
    <motion.h2
      variants={fadeUp}
      className="mx-auto mt-5 max-w-3xl text-center font-display text-4xl font-bold leading-[1.1] tracking-tight text-black sm:text-5xl"
    >
      Ce que disent nos utilisateurs{" "}
      <span className="inline-flex min-w-[6.5ch] justify-center align-bottom">
        <AnimatePresence mode="wait">
          <motion.span
            key={TESTIMONIAL_HEADLINE_WORDS[i]}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block font-bold text-black"
          >
            {TESTIMONIAL_HEADLINE_WORDS[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </motion.h2>
  );
}

function Testimonials() {
  const quotes: { name: string; role: string; body: string }[] = [
    {
      name: "Jakob Baker",
      role: "Responsable Marketing",
      body: "Je partage mon temps entre le travail client et le suivi des mises à jour des campagnes. Avoir les promesses, les documents et les délais en un seul endroit signifie que je lis vraiment les documents au lieu de parcourir des PDF à minuit. Lorsqu&apos;une question est apparue sur l&apos;éligibilité, le support a répondu avec des étapes claires le jour même.",
    },
    {
      name: "Kaitlynn Carder",
      role: "Gestionnaire de compte",
      body: "Notre équipe intègre de nouveaux membres chaque semaine, nous avions donc besoin d&apos;un flux qui semble calme et prévisible. Les points de contrôle de vérification sont explicites et les investisseurs savent toujours ce qui les bloque de l&apos;étape suivante.",
    },
    {
      name: "Anika Dulhanty",
      role: "Rédactrice Freelance",
      body: "J&apos;avais l&apos;habitude de perdre le fil des projets que je soutenais. Le tableau de bord me donne enfin une vue unique de l&apos;activité. Exporter un historique propre pour mon comptable était un projet de week-end — maintenant je peux tirer un résumé simple et passer à autre chose.",
    },
    {
      name: "Adryen Vanessa",
      role: "Fondatrice, Atelier",
      body: "Nous soutenons des opérateurs en démarrage, donc la rapidité et la clarté comptent. Je reçois une alerte quand le statut d&apos;une campagne change, quand une promesse est réglée et quand une nouvelle mise à jour est publiée — sans spam bruyant.",
    },
    {
      name: "Marcus Chen",
      role: "Responsable des opérations",
      body: "Nous gérons un petit fonds ; la paperasse de conformité vivait auparavant dans trois outils. Consolider les souscriptions et les notes de table de capitalisation dans un seul flux a considérablement réduit notre temps de préparation hebdomadaire.",
    },
    {
      name: "Priya Nandakumar",
      role: "Designer Produit",
      body: "L&apos;interface respecte la charge cognitive — je peux comparer deux offres côte à côte, puis revenir à mes engagements sans perdre le contexte. Cela semble minime, mais c&apos;est rare dans ce domaine.",
    },
  ];

  return (
    <Section className="bg-white py-24 text-black">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <motion.div variants={fadeUp}>
            <span className="inline-flex rounded-full border border-black/15 bg-white px-4 py-1.5 text-xs font-medium text-black/55">
              Témoignages
            </span>
          </motion.div>
          <TestimonialsHeading />
        </div>

        <div className="relative mx-auto mt-14 max-w-5xl">
          <div className="columns-1 gap-6 md:columns-2 md:gap-x-8">
            {quotes.map((q) => (
              <motion.div
                key={q.name}
                variants={fadeUp}
                className="mb-6 break-inside-avoid rounded-2xl border border-black/10 bg-white p-6 shadow-none md:mb-8 md:p-8"
              >
                <blockquote className="space-y-6">
                  <p className="text-[15px] font-normal leading-relaxed text-black/90 md:text-base">
                    <span className="text-black/25" aria-hidden>
                      &ldquo;
                    </span>
                    {q.body}
                    <span className="text-black/25" aria-hidden>
                      &rdquo;
                    </span>
                  </p>
                  <footer>
                    <p className="text-base font-semibold tracking-tight text-black md:text-lg">
                      {q.name}
                    </p>
                    <p className="mt-0.5 text-sm text-black/55 md:text-base">
                      {q.role}
                    </p>
                  </footer>
                </blockquote>
              </motion.div>
            ))}
          </div>

          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-36 bg-gradient-to-t from-white via-white/85 to-transparent md:h-44"
            aria-hidden
          />

          <div className="relative z-[2] -mt-12 flex justify-center pb-2 md:-mt-14">
            <motion.div variants={fadeUp}>
              <Link
                href="/investors"
                className="inline-flex rounded-full bg-black px-10 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Voir tout
              </Link>
            </motion.div>
          </div>
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
          Commencer
        </p>
        <h2 className="mx-auto mt-4 max-w-3xl font-display text-4xl leading-tight sm:text-5xl">
          Prêt à faire croître <Blank /> votre <br /> patrimoine ?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm opacity-70">
          Inscrivez-vous et commencez à investir en quelques minutes — aucun téléchargement requis pour commencer.
        </p>
        <Link
          href="/register"
          className="mt-8 inline-flex rounded-full bg-mint px-7 py-3.5 text-sm font-medium text-deep-green transition-transform hover:scale-[1.03] active:scale-[0.98]"
        >
          Commencer
        </Link>
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
      <CampaignsShowcase />
      <FeatureCards />
      <GettingStarted />
      <Testimonials />
      <FinalCTA />
    </main>
  );
}
