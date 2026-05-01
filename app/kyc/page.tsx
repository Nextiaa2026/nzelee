import type { Metadata } from "next";

import { KycView } from "@/components/kyc-view";

export const metadata: Metadata = {
  title: "Identity verification",
  description: "Submit documents so we can confirm eligibility for investing and withdrawals.",
};

export default function KycPage() {
  return (
    <div className="mx-auto w-full max-w-xl px-4 sm:px-6">
      <KycView />
    </div>
  );
}
