"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { PropertyListingCard, type PropertyListing } from "./property-listing-card";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

type CampaignApiRow = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  coverImageUrl: string | null;
  goalAmount: number;
  raisedAmount: number;
  currency: string;
  isFeatured: boolean;
  status: string;
};

function formatMoney(amountMinor: number, currency: string) {
  const major = amountMinor / 100;
  return major.toLocaleString(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
}

function toTag(status: string, isFeatured: boolean) {
  if (isFeatured) return "À la une";
  if (status === "LIVE") return "Nouveau";
  if (status === "FUNDED") return "Financé";
  return "Croissance";
}

export function CampaignsShowcase() {
  const [rows, setRows] = useState<CampaignApiRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const res = await fetch("/api/v1/public/campaigns", { cache: "no-store" });
        const json = (await res.json()) as { ok?: boolean; data?: CampaignApiRow[] };
        if (!ignore && json.ok && Array.isArray(json.data)) setRows(json.data);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    void load();
    return () => {
      ignore = true;
    };
  }, []);

  const listings: PropertyListing[] = useMemo(
    () =>
      rows.slice(0, 6).map((row) => {
        const funded =
          row.goalAmount > 0
            ? Math.max(0, Math.min(100, Math.round((row.raisedAmount / row.goalAmount) * 100)))
            : 0;
        return {
          slug: row.slug,
          img: row.coverImageUrl ?? "/landing/property-1.jpg",
          name: row.title,
          status: row.status,
          currency: row.currency,
          raised: formatMoney(row.raisedAmount, row.currency),
          goal: formatMoney(row.goalAmount, row.currency),
          funded,
          tag: toTag(row.status, row.isFeatured),
        };
      }),
    [rows],
  );

  return (
    <section className="bg-background py-16 text-foreground md:py-24" id="campaigns">
      <div className="mx-auto max-w-6xl px-4">
        <div className="sticky top-0 z-30 border-b border-foreground/10 bg-background/90 py-5 backdrop-blur-md md:py-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={stagger}
            >
              <motion.span
                variants={fadeUp}
                className="inline-block rounded-full border border-foreground/15 bg-card px-4 py-1.5 text-xs text-foreground/80"
              >
                Campagnes en cours
              </motion.span>
              <motion.h2
                variants={fadeUp}
                className="mt-4 max-w-xl font-display text-4xl leading-tight text-foreground sm:text-5xl"
              >
                Soutenez des projets sélectionnés
                <br /> parmi{" "}
                <span className="italic text-mint-foreground">{rows.length || 0}</span> offres actives
              </motion.h2>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="max-w-sm text-sm text-foreground/60"
            >
              Nexiaa se concentre sur des annonces immobilières et des offres structurées — des conditions transparentes et
              des outils membres simples.
            </motion.p>
          </div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
          variants={stagger}
          className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {listings.map((p) => (
            <PropertyListingCard key={p.slug} listing={p} />
          ))}
        </motion.div>
        {!loading && listings.length === 0 ? (
          <p className="mt-8 text-sm text-foreground/60">Aucune campagne en cours pour le moment.</p>
        ) : null}

        <div className="mt-10 text-center">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
            <Link
              href="/campaigns"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-card px-6 py-2.5 text-sm text-foreground backdrop-blur transition-colors hover:bg-muted"
            >
              Explorer toutes les campagnes
              <ArrowRight className="size-4 shrink-0" strokeWidth={2} aria-hidden />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
