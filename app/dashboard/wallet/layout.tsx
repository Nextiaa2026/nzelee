import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wallet",
  description: "Your Zeller wallet balance and payout activity.",
};

export default function WalletLayout({ children }: { children: React.ReactNode }) {
  return children;
}
