"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export type PropertyListing = {
  slug: string;
  img: string;
  name: string;
  status: string;
  currency: string;
  raised: string;
  goal: string;
  funded: number;
  tag: string;
};

const tagAccent: Record<string, string> = {
  Featured: "bg-mint text-black",
  New: "bg-emerald-400 text-black",
  Hot: "bg-amber-400 text-black",
  Growth: "bg-lime-300 text-black",
  Green: "bg-emerald-600 text-white",
};

function tagClass(tag: string) {
  return tagAccent[tag] ?? "bg-neutral-200 text-black";
}

export function PropertyListingCard({ listing }: { listing: PropertyListing }) {
  const { slug, img, name, status, currency, raised, goal, funded, tag } = listing;

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group overflow-hidden rounded-3xl bg-white text-neutral-900 shadow-sm ring-1 ring-black/10"
    >
      <div className="relative h-48 overflow-hidden">
        <motion.img
          src={img}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.5 }}
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${tagClass(tag)}`}
        >
          {tag}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-black/85 px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-white backdrop-blur">
          Campaign
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-semibold leading-tight">{name}</h3>
        <p className="text-xs uppercase tracking-wide text-neutral-500">{status}</p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-neutral-500">Raised</div>
            <div className="font-display text-lg text-neutral-900">{raised}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-neutral-500">Currency</div>
            <div className="font-display text-lg">{currency}</div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-[10px] text-neutral-500">
            <span>{funded}% funded</span>
            <span>Goal {goal}</span>
          </div>
          <div className="mt-1.5 h-1.5 rounded-full bg-neutral-200">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${funded}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full rounded-full bg-black"
            />
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="mt-5"
        >
          <Link
            href={`/campaigns/${slug}`}
            className="inline-flex w-full items-center justify-center gap-1 rounded-full bg-mint py-2.5 text-xs font-medium text-deep-green transition-colors hover:bg-mint/90"
          >
            Invest now
            <ArrowRight className="size-3.5" />
          </Link>
        </motion.div>
      </div>
    </motion.article>
  );
}
