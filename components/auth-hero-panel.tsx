"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LineChart, PiggyBank, ShieldCheck, Timer } from "lucide-react";

const ROTATING_COPY = [
  "Three campaigns hit their minimums last week — backers saw updates in real time.",
  "You always see ticket size, fees, and key dates before you confirm a pledge.",
  "Verification and eligibility rules are spelled out so you know what unlocks investing.",
  "Campaign pages separate marketing from the structured facts: minimums, risks, and timelines.",
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
    title: "Pipeline pulse",
    body: "Live pledges across open campaigns this week.",
    metric: "$2.1M",
    metricLabel: "indicative volume",
    surface: "bg-mint text-deep-green",
    iconWrap: "bg-deep-green/15 text-deep-green",
  },
  {
    Icon: Timer,
    title: "Closing windows",
    body: "Countdowns stay visible so you never miss a deadline.",
    metric: "3 live",
    metricLabel: "ending in under 14 days",
    surface: "bg-amber-200 text-foreground",
    iconWrap: "bg-foreground/10 text-foreground",
  },
  {
    Icon: ShieldCheck,
    title: "Checks first",
    body: "KYC and jurisdiction gates only when an offer requires them.",
    metric: "~1 day",
    metricLabel: "typical review",
    surface: "bg-deep-green text-deep-green-foreground",
    iconWrap: "bg-deep-green-foreground/15 text-deep-green-foreground",
  },
  {
    Icon: PiggyBank,
    title: "Clear economics",
    body: "Minimums and platform economics are shown before checkout.",
    metric: "From $95",
    metricLabel: "seen on listings",
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
        <div className="mb-8 w-full max-w-md">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-deep-green-foreground/20 bg-deep-green/40 px-3 py-1.5 text-xs font-medium text-deep-green-foreground/90 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />
            Regulated crowdfunding access
          </div>
          <h2 className="mt-6 text-center font-display text-3xl font-bold leading-tight tracking-tight text-deep-green-foreground xl:text-4xl">
            Invest in curated
            <br />
            company campaigns.
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
          Member onboarding and disclosures are updated as rules change.
        </p>
      </div>
    </div>
  );
}
