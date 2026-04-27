"use client";

import { motion } from "framer-motion";

/**
 * Auth illustration panel — matches landing hero: bg-hero-bg, mint radial glows.
 */
export function AuthHeroPanel() {
  return (
    <div className="relative hidden h-full min-h-svh flex-col overflow-hidden bg-hero-bg hero-glow text-deep-green-foreground lg:flex lg:w-[54%]">
      <motion.div
        className="pointer-events-none absolute -left-20 top-20 h-[500px] w-[500px] rounded-full lg:block"
        style={{
          background:
            "radial-gradient(circle, oklch(0.78 0.16 145 / 0.35), transparent 70%)",
        }}
        animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -right-32 top-40 h-[600px] w-[600px] rounded-full lg:block"
        style={{
          background:
            "radial-gradient(circle, oklch(0.78 0.16 145 / 0.25), transparent 70%)",
        }}
        animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative flex h-full flex-col justify-between p-10 text-deep-green-foreground xl:p-14">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-deep-green-foreground/20 bg-deep-green/40 px-3 py-1.5 text-xs font-medium text-deep-green-foreground backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-mint" />
          Regulated crowdfunding access
        </div>

        <div className="space-y-8">
          <h2 className="font-display text-3xl font-bold leading-tight tracking-tight xl:text-4xl">
            Invest in curated
            <br />
            property opportunities.
          </h2>
          <p className="max-w-md text-sm text-deep-green-foreground/80">
            Nexiaa helps you commit capital to vetted projects with clear terms —
            transparent reporting and a straightforward member experience.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <AuthStatCard label="Member onboarding" value="Minutes" />
            <AuthStatCard label="Support" value="Dedicated" />
            <AuthStatCard label="Reporting" value="Transparent" />
            <AuthStatCard label="Identity checks" value="When you invest" />
          </div>
        </div>

        <p className="text-xs text-deep-green-foreground/55">
          Investing involves risk. Past performance does not guarantee future
          returns. Read each offer carefully before you commit.
        </p>
      </div>
    </div>
  );
}

function AuthStatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-deep-green-foreground/15 bg-deep-green/35 p-4 backdrop-blur-sm">
      <div className="font-display text-xl font-bold text-deep-green-foreground">
        {value}
      </div>
      <div className="mt-1 text-xs text-deep-green-foreground/70">{label}</div>
    </div>
  );
}
