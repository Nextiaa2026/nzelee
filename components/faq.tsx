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
    name: "Getting started",
    items: [
      {
        q: "Who can invest on Zeller?",
        a: "Zeller supports members who complete onboarding and meet eligibility rules for each offering. Some opportunities are limited by jurisdiction or investor category; details appear in each campaign’s documents.",
      },
      {
        q: "How long does account setup take?",
        a: "Creating an account takes a few minutes. Email verification is immediate once you enter your code. Identity (KYC) review is typically completed within one business day when you submit documents.",
      },
      {
        q: "Is there a minimum investment?",
        a: "Minimums are set per campaign. You will see the minimum commitment on each offering before you subscribe.",
      },
    ],
  },
  {
    name: "Fees & returns",
    items: [
      {
        q: "What fees does Zeller charge?",
        a: "Fees depend on the product. Platform and processing fees, if any, are disclosed in the offering materials and checkout flow before you confirm a commitment.",
      },
      {
        q: "Are returns guaranteed?",
        a: "No. Crowdfunding and private investments involve risk, including loss of principal. Any projections or past performance figures are illustrative, not guarantees.",
      },
      {
        q: "How do distributions work?",
        a: "When an investment pays distributions, they are described in the offering documents (schedule, waterfall, and tax reporting). Use your dashboard to track activity as features roll out.",
      },
    ],
  },
  {
    name: "Compliance & security",
    items: [
      {
        q: "How is my data protected?",
        a: "We use industry-standard encryption in transit (HTTPS) and secure storage practices. Only limited staff can access verification data, and we do not sell your personal information.",
      },
      {
        q: "Why do I need to complete KYC?",
        a: "Know Your Customer checks help us meet anti–money laundering rules and protect the community. You can defer KYC at the end of onboarding and finish it anytime from Verification in your profile menu (or the /kyc page) before funding.",
      },
      {
        q: "What if my KYC is rejected?",
        a: "We will explain the reason when possible (e.g. unreadable ID or mismatch with your profile). You can usually re-submit corrected documents.",
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
              Help center
            </p>
            <h2 className="mx-auto mt-3 max-w-2xl font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Frequently asked questions
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Can&apos;t find what you&apos;re looking for?{" "}
              <Link
                href="/contact"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Contact us
              </Link>{" "}
              or visit the{" "}
              <Link
                href="/help"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                help center
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
