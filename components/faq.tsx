"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const stagger = {
  show: { transition: { staggerChildren: 0.06 } },
};

export const faqGroups = [
  {
    name: "Premiers pas",
    items: [
      {
        q: "Qui peut investir sur Nzelee ?",
        a: "Nzelee accompagne les membres qui terminent l'inscription et respectent les règles d'éligibilité de chaque offre. Certaines opportunités sont limitées par juridiction ou catégorie d'investisseur ; les détails figurent dans les documents de chaque campagne.",
      },
      {
        q: "Combien de temps prend la création de compte ?",
        a: "Quelques minutes suffisent. La vérification e-mail est immédiate après saisie du code. L'examen KYC est en général traité sous un jour ouvré une fois les documents envoyés.",
      },
      {
        q: "Y a-t-il un investissement minimum ?",
        a: "Les minimums sont fixés par campagne. Vous voyez le montant minimum sur chaque offre avant de vous engager.",
      },
    ],
  },
  {
    name: "Frais & rendements",
    items: [
      {
        q: "Quels frais Nzelee applique-t-il ?",
        a: "Les frais dépendent du produit. Les frais de plateforme et de traitement, le cas échéant, sont indiqués dans les documents de l'offre et au moment du paiement avant confirmation.",
      },
      {
        q: "Les rendements sont-ils garantis ?",
        a: "Non. Le financement participatif et les investissements privés comportent un risque, y compris une perte en capital. Toute projection ou performance passée est illustrative, sans garantie.",
      },
      {
        q: "Comment fonctionnent les distributions ?",
        a: "Lorsqu'un investissement verse des distributions, le calendrier et les modalités sont décrits dans les documents de l'offre. Suivez l'activité depuis votre tableau de bord.",
      },
    ],
  },
  {
    name: "Conformité & sécurité",
    items: [
      {
        q: "Comment mes données sont-elles protégées ?",
        a: "Nous utilisons un chiffrement standard en transit (HTTPS) et des pratiques de stockage sécurisées. Seul un personnel limité accède aux données de vérification ; nous ne vendons pas vos informations personnelles.",
      },
      {
        q: "Pourquoi dois-je compléter le KYC ?",
        a: "Les contrôles Know Your Customer nous aident à respecter la lutte contre le blanchiment et à protéger la communauté. Vous pouvez reporter le KYC à la fin de l'inscription et le terminer depuis Vérification dans votre profil (ou /kyc) avant de financer.",
      },
      {
        q: "Que se passe-t-il si mon KYC est refusé ?",
        a: "Nous expliquons la raison lorsque c'est possible (pièce illisible, incohérence avec le profil, etc.). Vous pouvez en général renvoyer des documents corrigés.",
      },
    ],
  },
];

const faqItemsFlat = faqGroups.flatMap((g, gi) =>
  g.items.map((it, ii) => ({
    ...it,
    group: g.name,
    value: `faq-${gi}-${ii}`,
  })),
);

type FaqSectionProps = {
  className?: string;
  hideHeader?: boolean;
};

export function FaqSection({ className, hideHeader = false }: FaqSectionProps) {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.12 }}
      variants={stagger}
      className={cn("bg-surface-muted py-24", className)}
      id="faq"
    >
      <div className="mx-auto max-w-6xl px-4">
        {!hideHeader && (
          <motion.div variants={fadeUp} className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Centre d&apos;aide
            </p>
            <h2 className="mx-auto mt-3 max-w-2xl font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Questions fréquentes
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Vous ne trouvez pas votre réponse ?{" "}
              <Link
                href="/contact"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Contactez-nous
              </Link>{" "}
              ou consultez le{" "}
              <Link
                href="/help"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                centre d&apos;aide
              </Link>
              .
            </p>
          </motion.div>
        )}


        <motion.div variants={fadeUp} className="mx-auto mt-14 max-w-3xl">
          <Accordion
            type="single"
            collapsible
            className="rounded-2xl border border-border bg-card px-1 shadow-sm sm:px-2"
          >
            {faqItemsFlat.map((item) => (
              <AccordionItem
                key={item.value}
                value={item.value}
                className="border-border px-2 sm:px-3"
              >
                <AccordionTrigger className="text-left text-[15px] sm:text-base [&>svg]:ml-2">
                  <span className="flex min-w-0 flex-1 flex-col items-start gap-1 pr-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {item.group}
                    </span>
                    <span className="font-medium text-foreground">{item.q}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-2 text-[15px] leading-relaxed text-muted-foreground sm:px-3">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </motion.section>
  );
}
