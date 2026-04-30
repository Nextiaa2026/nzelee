import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saved campaigns",
  description: "Campaigns you saved on Zeller.",
};

export default function SavedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
