import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse campaigns",
  description: "Explore live and funded campaigns on Zeller. Save listings to your dashboard.",
};

export default function CampaignsLayout({ children }: { children: React.ReactNode }) {
  return <div className="bg-white text-foreground">{children}</div>;
}
