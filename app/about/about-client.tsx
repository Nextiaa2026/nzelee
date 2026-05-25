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
    d: "Pas de frais cachés. Chaque coût, risque et rendement est affiché d'avance — toujours.",
  },
  {
    t: "Accessibilité",
    d: "Commencez avec 10 $. Nous pensons que la création de patrimoine ne devrait jamais dépendre d'un solde minimum.",
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
          v: `${((stats.totalRaised ?? 0) / 100 / 1_000_000).toFixed(1)}M XAF`,
          l: "Actifs investis",
        },
        {
          v: `${((stats.totalInvestors ?? 0) / 1000).toFixed(0)}k+`,
          l: "Investisseurs actifs",
        },
        { v: String(stats.activeCampaigns ?? 0), l: "Campagnes actives" },
        { v: `${(stats.averageRating ?? 0).toFixed(1)}★`, l: "Note moyenne" },
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
              className="overflow-hidden rounded-3xl border border-deep-green/12 bg-white p-6 text-center shadow-sm ring-1 ring-mint/20 transition-transform hover:-translate-y-1 hover:border-mint/40"
            >
              <p
                className={`font-display text-4xl text-deep-green ${isLoading ? "animate-pulse" : ""}`}
              >
                {s.v}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-widest text-deep-green/55">
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
            alt="Notre espace de travail"
            className="h-[420px] w-full rounded-3xl object-cover"
          />
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-mint">
              Notre histoire
            </p>
            <h2 className="font-display mt-3 text-4xl text-deep-green">
              D&apos;une table de cuisine à un mouvement.
            </h2>
            <p className="mt-5 text-deep-green/70">
              En 2021, nos fondateurs ont vu leurs amis et leur famille lutter pour accéder aux mêmes opportunités dont les institutions profitaient chaque jour. Nous avons construit Nzelle pour renverser la situation — en regroupant le capital, en réduisant les frais et en apportant des investissements de qualité institutionnelle à toute personne disposant d&apos;un téléphone.
            </p>
            <p className="mt-3 text-deep-green/70">
              Aujourd&apos;hui, des centaines de milliers d&apos;investisseurs font confiance à Nzelle pour faire fructifier leur patrimoine à travers les actions, les ETFs, la crypto et l&apos;immobilier tokenisé.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-deep-green/[0.04] py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-center text-4xl text-deep-green">
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
                className="rounded-3xl border border-deep-green/10 bg-white p-7 shadow-sm ring-1 ring-mint/15"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-mint font-display text-lg font-semibold text-deep-green">
                  {i + 1}
                </div>
                <h3 className="font-display mt-4 text-2xl text-deep-green">
                  {v.t}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-deep-green/65">
                  {v.d}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-24">
        <h2 className="font-display text-center text-4xl text-deep-green">
          Explorer
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-deep-green/60">
          Consultez les annonces en direct sur le répertoire des campagnes, ou
          ouvrez votre tableau de bord après vous être connecté.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button
            asChild
            className="h-12 rounded-full bg-mint px-10 text-sm font-semibold text-deep-green hover:bg-mint/90"
          >
            <Link href="/campaigns">Voir les campagnes</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-12 rounded-full border-deep-green/25 bg-white px-10 text-sm font-medium text-deep-green hover:border-mint/50 hover:bg-mint/10"
          >
            <Link href="/register">S&apos;inscrire</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-12 rounded-full border-deep-green/25 bg-white px-10 text-sm font-medium text-deep-green hover:border-mint/50 hover:bg-mint/10"
          >
            <Link href="/login">Se connecter</Link>
          </Button>
        </div>
        <p className="mt-8 text-center text-sm text-deep-green/50">
          <Link
            href="/terms-of-service"
            className="font-medium hover:text-deep-green"
          >
            Conditions d&apos;utilisation
          </Link>
          {" · "}
          <Link
            href="/privacy-policy"
            className="font-medium hover:text-deep-green"
          >
            Politique de confidentialité
          </Link>
        </p>
      </section>
    </main>
  );
}
