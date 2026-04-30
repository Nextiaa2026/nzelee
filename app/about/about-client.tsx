"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

import { PageHero } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { landingImages } from "@/lib/landing-images";
import { httpClient } from "@/lib/http/client";

const VALUES = [
  {
    t: "Transparence",
    d: "Pas de frais cachés. Chaque coût, risque et rendement est affiché d&apos;avance — toujours.",
  },
  {
    t: "Accessibilité",
    d: "Commencez avec 10 $. Nous pensons que la création de patrimoine ne devrait jamais dépendre d&apos;un solde minimum.",
  },
  {
    t: "Pensée à long terme",
    d: "Nous optimisons pour des décennies, pas des jours. Nos outils vous poussent vers des gains cumulés.",
  },
];

interface PlatformStats {
  totalCampaigns: number;
  totalInvestors: number;
  totalRaised: number;
  activeCampaigns: number;
  averageRating: number;
  totalReviews: number;
  minInvestment: number;
  maxInvestment: number;
}

async function fetchPlatformStats(): Promise<PlatformStats> {
  const response = await httpClient.get("/public/platform-stats");
  return response.data;
}

export function AboutPageClient() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["platform-stats"],
    queryFn: fetchPlatformStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Format the stats for display
  const formattedStats = stats
    ? [
        {
          v: `${(stats.totalRaised / 100 / 1000000).toFixed(1)}M XAF`,
          l: "Actifs investis",
        },
        {
          v: `${(stats.totalInvestors / 1000).toFixed(0)}k+`,
          l: "Investisseurs actifs",
        },
        { v: stats.activeCampaigns.toString(), l: "Campagnes actives" },
        { v: `${stats.averageRating.toFixed(1)}★`, l: "Note moyenne" },
      ]
    : [
        { v: "...", l: "Actifs investis" },
        { v: "...", l: "Investisseurs actifs" },
        { v: "...", l: "Campagnes actives" },
        { v: "...", l: "Note moyenne" },
      ];

  return (
    <main>
      <PageHero
        eyebrow="À propos"
        title={
          <>
            Bâtir l&apos;avenir de{" "}
            <span className="text-mint">l&apos;investissement quotidien</span>
          </>
        }
        subtitle="Nous avons lancé Nzelle pour abattre les murs entre les gens et les marchés — rendant l&apos;investissement sérieux aussi simple que l&apos;envoi d&apos;un texte."
      />

      <section className="mx-auto -mt-16 max-w-6xl px-4">
        <div className="grid gap-4 md:grid-cols-4">
          {formattedStats.map((s, i) => (
            <motion.div
              key={s.l}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="overflow-hidden rounded-3xl border border-foreground/10 bg-surface p-6 text-center transition-transform hover:-translate-y-2"
            >
              <p
                className={`font-display text-4xl text-deep-green ${isLoading ? "animate-pulse" : ""}`}
              >
                {s.v}
              </p>
              <p className="mt-1 text-xs uppercase tracking-widest text-foreground/50">
                {s.l}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-24">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <motion.img
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            src={landingImages.deskFlatlay}
            alt="Our workspace"
            className="h-[420px] w-full rounded-3xl object-cover"
          />
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs uppercase tracking-widest text-deep-green">
              Notre histoire
            </p>
            <h2 className="font-display mt-3 text-4xl">
              D&apos;une table de cuisine à un mouvement.
            </h2>
            <p className="mt-5 text-foreground/70">
              En 2021, nos fondateurs ont vu leurs amis et leur famille lutter pour accéder aux mêmes opportunités dont les institutions profitaient chaque jour. Nous avons construit Nzelle pour renverser la situation — en regroupant le capital, en réduisant les frais et en apportant des investissements de qualité institutionnelle à toute personne disposant d&apos;un téléphone.
            </p>
            <p className="mt-3 text-foreground/70">
              Aujourd&apos;hui, des centaines de milliers d&apos;investisseurs font confiance à Nzelle pour faire fructifier leur patrimoine à travers les actions, les ETFs, la crypto et l&apos;immobilier tokenisé.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-surface-muted py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-center text-4xl">
            Ce que nous défendons
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.t}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="neumorph-pop p-7"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mint/30 font-display text-deep-green">
                  {i + 1}
                </div>
                <h3 className="font-display mt-4 text-2xl">{v.t}</h3>
                <p className="mt-2 text-sm text-foreground/65">{v.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-24">
        <h2 className="font-display text-center text-4xl">Explorer</h2>
        <p className="mt-3 text-center text-foreground/60">
          Consultez les annonces en direct sur le répertoire des campagnes, ou ouvrez votre tableau de bord après vous être connecté.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/campaigns">Voir les campagnes</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/register">S&apos;inscrire</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/login">Se connecter</Link>
          </Button>
        </div>
        <p className="mt-6 text-center text-sm text-foreground/50">
          <Link href="/terms-of-service" className="hover:text-foreground">
            Conditions d&apos;utilisation
          </Link>
          {" · "}
          <Link href="/privacy-policy" className="hover:text-foreground">
            Politique de confidentialité
          </Link>
        </p>
      </section>
    </main>
  );
}
