import type { Metadata } from "next";

import { PageHero } from "@/components/page-shell";
import { FaqSection } from "@/components/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Zeller accounts, investing, and compliance.",
};

export default function FaqPage() {
  return (
    <main>
      <PageHero
        eyebrow="Help Center"
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about Zeller, investing, and more."
      />
      <FaqSection className="-mt-16 py-16 md:py-20" />
    </main>
  );
}
