import type { Metadata } from "next";
import Link from "next/link";
import { Medal } from "lucide-react";

import { HeroSection } from "@/components/hero-section";
import { landingImages } from "@/lib/landing-images";
import {
  listTopInvestors,
  type TopInvestorRow,
} from "@/lib/services/top-investors";

export const metadata: Metadata = {
  title: "Top Investors Leaderboard",
  description:
    "Discover top-ranked investors on FlowFin, their portfolios, and the projects they back.",
};

const tierStyle: Record<TopInvestorRow["tier"], string> = {
  Diamond: "bg-foreground text-background",
  Platinum: "bg-mint text-mint-foreground",
  Gold: "bg-amber-200 text-foreground",
  Silver: "bg-foreground/10 text-foreground",
};

function Header() {
  return (
    <HeroSection
      badge={{ text: "Live leaderboard · Updated hourly", pulse: true }}
      title={
        <>
          Top investors,
          <br />
          ranked by performance
        </>
      }
      description="Browse the FlowFin community leaderboard. See who is leading by YTD returns, portfolio size, and the projects they are backing."
      image={landingImages.investorsTeam}
    />
  );
}

function PodiumCard({ investor }: { investor: TopInvestorRow }) {
  const medalClass =
    investor.rank === 1
      ? "text-amber-500"
      : investor.rank === 2
        ? "text-slate-400"
        : "text-amber-800";
  return (
    <div className="neumorph relative flex flex-col items-center gap-3 p-6 text-center">
      <span className="absolute -top-3 right-4 rounded-full bg-foreground px-3 py-1 text-xs text-background">
        #{investor.rank}
      </span>
      <div
        className={`flex h-20 w-20 items-center justify-center rounded-full ${investor.accent} font-display text-2xl`}
      >
        {investor.initials}
      </div>
      <Medal
        className={`size-10 ${medalClass}`}
        strokeWidth={1.75}
        aria-hidden
      />
      <div>
        <div className="font-semibold">{investor.name}</div>
        <div className="text-xs text-foreground/50">{investor.handle}</div>
      </div>
      <div className="grid w-full grid-cols-2 gap-2 pt-2">
        <div className="neumorph-inset p-3">
          <div className="text-[10px] uppercase tracking-wider text-foreground/50">
            Portfolio
          </div>
          <div className="font-display text-lg">{investor.portfolio}</div>
        </div>
        <div className="neumorph-inset p-3">
          <div className="text-[10px] uppercase tracking-wider text-foreground/50">
            YTD
          </div>
          <div className="font-display text-lg text-mint-foreground">
            {investor.ytd}
          </div>
        </div>
      </div>
    </div>
  );
}

function Podium({ investors }: { investors: TopInvestorRow[] }) {
  const top3 = investors.slice(0, 3);
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-center text-xs uppercase tracking-widest text-foreground/50">
          Hall of fame
        </p>
        <h2 className="mx-auto mt-3 max-w-xl text-center font-display text-4xl sm:text-5xl">
          This week&apos;s top performers
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {top3.map((inv) => (
            <PodiumCard key={inv.rank} investor={inv} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Leaderboard({ investors }: { investors: TopInvestorRow[] }) {
  return (
    <section className="bg-background pb-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-foreground/50">
              Full ranking
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">
              All investors
            </h2>
          </div>
          <div className="flex gap-2 text-xs">
            {["All", "Diamond", "Platinum", "Gold", "Silver"].map((t, i) => (
              <button
                key={t}
                type="button"
                className={`rounded-full px-4 py-2 ${i === 0 ? "bg-foreground text-background" : "border border-foreground/15 text-foreground/70"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl bg-surface-muted">
          <div className="hidden grid-cols-12 gap-4 border-b border-foreground/10 px-6 py-4 text-[11px] uppercase tracking-wider text-foreground/50 md:grid">
            <div className="col-span-1">Rank</div>
            <div className="col-span-3">Investor</div>
            <div className="col-span-2">Tier</div>
            <div className="col-span-2">Portfolio</div>
            <div className="col-span-1">YTD</div>
            <div className="col-span-3">Top projects</div>
          </div>
          {investors.map((inv) => (
            <div
              key={inv.rank}
              className="grid grid-cols-1 gap-3 border-b border-foreground/5 px-6 py-5 transition-colors hover:bg-surface md:grid-cols-12 md:items-center md:gap-4"
            >
              <div className="col-span-1 font-display text-2xl text-foreground/40">
                #{inv.rank}
              </div>
              <div className="col-span-3 flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full ${inv.accent} text-sm font-semibold`}
                >
                  {inv.initials}
                </div>
                <div>
                  <div className="font-semibold">{inv.name}</div>
                  <div className="text-xs text-foreground/50">{inv.handle}</div>
                </div>
              </div>
              <div className="col-span-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs ${tierStyle[inv.tier]}`}
                >
                  {inv.tier}
                </span>
              </div>
              <div className="col-span-2 font-display text-xl">
                {inv.portfolio}
              </div>
              <div className="col-span-1 text-sm font-semibold text-mint-foreground">
                {inv.ytd}
              </div>
              <div className="col-span-3 flex flex-wrap gap-1.5">
                {inv.projects.map((p) => (
                  <span
                    key={p}
                    className="rounded-full bg-surface px-3 py-1 text-xs text-foreground/70"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="px-4 pb-16">
      <div className="mx-auto max-w-6xl rounded-3xl bg-mint p-12 text-center">
        <h2 className="mx-auto max-w-3xl font-display text-4xl text-mint-foreground sm:text-5xl">
          Want to climb the ranks?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-mint-foreground/70">
          Join FlowFin, build your portfolio, and let your performance speak.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background"
        >
          Start investing
        </Link>
      </div>
    </section>
  );
}

export default async function InvestorsPage() {
  const investors = await listTopInvestors();
  return (
    <main>
      <Header />
      <Podium investors={investors} />
      <Leaderboard investors={investors} />
      <CTA />
    </main>
  );
}
