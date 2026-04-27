"use client";

import { motion } from "framer-motion";

import { landingImages } from "@/lib/landing-images";

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

const defaultListings: PropertyListing[] = [
  {
    img: landingImages.property1,
    name: "The Aurora Residences",
    location: "Austin, TX",
    type: "Residential",
    roi: "9.2%",
    price: "$120",
    funded: 78,
    tag: "New",
  },
  {
    img: landingImages.property2,
    name: "Casa del Sol Hotel",
    location: "Marbella, ES",
    type: "Hospitality",
    roi: "11.4%",
    price: "$250",
    funded: 92,
    tag: "Hot",
  },
  {
    img: landingImages.property3,
    name: "Verde Coworking Hub",
    location: "Lisbon, PT",
    type: "Commercial",
    roi: "8.6%",
    price: "$95",
    funded: 54,
    tag: "Growth",
  },
  {
    img: landingImages.property4,
    name: "Helios Solar Logistics",
    location: "Phoenix, AZ",
    type: "Industrial",
    roi: "10.1%",
    price: "$180",
    funded: 41,
    tag: "Green",
  },
];

type PropertiesShowcaseProps = {
  listings?: PropertyListing[];
};

export function PropertiesShowcase({ listings = defaultListings }: PropertiesShowcaseProps) {
  return (
    <section className="bg-background py-16 text-foreground md:py-24" id="properties">
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
                Real properties
              </motion.span>
              <motion.h2
                variants={fadeUp}
                className="mt-4 max-w-xl font-display text-4xl leading-tight text-foreground sm:text-5xl"
              >
                Invest in real properties
                <br /> from <span className="italic text-mint-foreground">$95</span> a share
              </motion.h2>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="max-w-sm text-sm text-foreground/60"
            >
              Curated, vetted real-estate deals across hospitality, residential, commercial and green
              energy. Earn passive income with full transparency.
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
            <PropertyListingCard key={p.name} listing={p} />
          ))}
        </motion.div>

        <div className="mt-10 text-center">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-full border border-foreground/20 bg-card px-6 py-2.5 text-sm text-foreground backdrop-blur transition-colors hover:bg-muted"
          >
            Explore all properties →
          </motion.button>
        </div>
      </div>
    </section>
  );
}
