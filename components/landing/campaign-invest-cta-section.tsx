import Link from "next/link";

import { Button } from "@/components/ui/button";

export function CampaignInvestCtaSection() {
  return (
    <section className="px-4 pb-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center rounded-3xl border border-black/10 bg-black/5 p-8 text-center sm:p-10">
        <p className="text-xs font-medium uppercase tracking-widest text-black/55">
          Campaign Access
        </p>
        <h2 className="mt-3 font-display text-3xl tracking-tight text-black/90 sm:text-4xl">
          See campaign details and invest
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-black/65">
          Browse live campaigns, open full details, then invest from the campaign page — your
          commitments appear in your dashboard.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href="/campaigns">View campaigns</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/investments">My commitments</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
