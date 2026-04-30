import type { Metadata } from "next";
import { AboutPageClient } from "./about-client";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about our mission to make investing accessible to everyone",
};

export default function AboutPage() {
  return <AboutPageClient />;
}
