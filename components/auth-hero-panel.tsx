"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LineChart, PiggyBank, ShieldCheck, Timer } from "lucide-react";

import { CompanyBrandMark } from "@/components/company-brand-mark";

const ROTATING_COPY = [
  "Trois campagnes ont atteint leur minimum la semaine dernière — les contributeurs ont suivi les mises à jour en direct.",
  "Vous voyez toujours le ticket, les frais et les dates clés avant de confirmer une promesse.",
  "Les règles de vérification et d'éligibilité sont détaillées pour savoir ce qui débloque l'investissement.",
  "Chaque page sépare le marketing des faits structurés : minimums, risques et calendriers.",
];

const TILES: {
  Icon: typeof LineChart;
  title: string;
  body: string;
  metric: string;
  metricLabel: string;
  surface: string;
  iconWrap: string;
}[] = [
  {
    Icon: LineChart,
    title: "Pouls du pipeline",
    body: "Promesses en direct sur les campagnes ouvertes cette semaine.",
    metric: "2,1 M$",
    metricLabel: "volume indicatif",
    surface: "bg-mint text-deep-green",
    iconWrap: "bg-deep-green/15 text-deep-green",
  },
  {
    Icon: Timer,
    title: "Fenêtres de clôture",
    body: "Les comptes à rebours restent visibles pour ne manquer aucune échéance.",
    metric: "3 actives",
    metricLabel: "fin sous 14 jours",
    surface: "bg-amber-200 text-foreground",
    iconWrap: "bg-foreground/10 text-foreground",
  },
  {
    Icon: ShieldCheck,
    title: "Contrôles d'abord",
    body: "KYC et critères de juridiction uniquement si l'offre l'exige.",
    metric: "~1 jour",
    metricLabel: "examen type",
    surface: "bg-deep-green text-deep-green-foreground",
    iconWrap: "bg-deep-green-foreground/15 text-deep-green-foreground",
  },
  {
    Icon: PiggyBank,
    title: "Économie claire",
    body: "Minimums et frais affichés avant le paiement.",
    metric: "Dès 95 $",
    metricLabel: "sur les annonces",
    surface: "bg-foreground text-background",
    iconWrap: "bg-background/15 text-background",
  },
];

/**
 * Auth illustration — centered tiles + light motion to hint at live crowdfunding activity.
 */
export function AuthHeroPanel() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setTick((n) => (n + 1) % ROTATING_COPY.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="relative hidden h-full min-h-svh flex-col overflow-hidden border-l border-deep-green-foreground/15 bg-hero-bg text-deep-green-foreground lg:flex lg:w-[54%]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_18%,oklch(0.78_0.16_145/0.22),transparent_58%)]" />

      <div className="relative flex h-full flex-col items-center justify-center px-8 py-12 xl:px-14">
        <div className="mb-10 flex w-full max-w-md justify-center">
          <CompanyBrandMark variant="horizontalDarkBg" href="/" />
        </div>
        <div className="mb-8 w-full max-w-md">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-deep-green-foreground/20 bg-deep-green/40 px-3 py-1.5 text-xs font-medium text-deep-green-foreground/90 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />
            Accès réglementé au financement participatif
          </div>
          <h2 className="mt-6 text-center font-display text-3xl font-bold leading-tight tracking-tight text-deep-green-foreground xl:text-4xl">
            Investissez dans des
            <br />
            campagnes sélectionnées.
          </h2>

          <div className="relative mx-auto mt-5 min-h-13 max-w-lg text-center text-sm leading-relaxed text-deep-green-foreground/70">
            <AnimatePresence mode="wait">
              <motion.p
                key={tick}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {ROTATING_COPY[tick]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        <div className="mx-auto grid w-full max-w-md grid-cols-2 gap-3 sm:gap-4">
          {TILES.map((tile, i) => (
            <motion.div
              key={tile.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.08 + i * 0.1,
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`flex min-h-[148px] flex-col rounded-2xl p-4 shadow-sm ring-1 ring-deep-green-foreground/10 sm:min-h-[158px] sm:p-5 ${tile.surface}`}
            >
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{
                  duration: 4 + i * 0.35,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
                className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${tile.iconWrap}`}
              >
                <tile.Icon
                  className="size-5 sm:size-[22px]"
                  strokeWidth={2}
                  aria-hidden
                />
              </motion.div>
              <p className="text-sm font-semibold leading-tight">
                {tile.title}
              </p>
              <p className="mt-1 flex-1 text-[11px] leading-snug opacity-90 sm:text-xs">
                {tile.body}
              </p>
              <div className="mt-3 border-t border-current/15 pt-3">
                <motion.p
                  className="font-display text-lg leading-none sm:text-xl"
                  animate={{ opacity: [0.85, 1, 0.85] }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.15,
                  }}
                >
                  {tile.metric}
                </motion.p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wider opacity-75 sm:text-[11px]">
                  {tile.metricLabel}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-md text-center text-[11px] text-deep-green-foreground/55">
          L&apos;inscription des membres et les informations réglementaires sont
          mises à jour selon l&apos;évolution des règles applicables.
        </p>
      </div>
    </div>
  );
}
