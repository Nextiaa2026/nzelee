import type { Metadata } from "next";
import { AboutPageClient } from "./about-client";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Découvrez notre mission : rendre l'investissement accessible à tous",
};

export default function AboutPage() {
  return <AboutPageClient />;
}
