import Link from "next/link";

import { LegalPage } from "@/components/legal-page";

export default function DashboardKycPage() {
  return (
    <LegalPage
      eyebrow="Verification"
      title="Know Your Customer (KYC)"
      updatedAt="April 2026"
      intro={
        <p>
          This is a temporary KYC information page. We will connect full KYC flows here in the
          next update.
        </p>
      }
      sections={[
        {
          id: "requirements",
          title: "What you will need",
          body: (
            <ul className="ml-5 list-disc space-y-2">
              <li>One valid government-issued photo ID.</li>
              <li>A short selfie or liveness verification step.</li>
              <li>A compliant profile with matching legal details.</li>
            </ul>
          ),
        },
        {
          id: "why",
          title: "Why KYC is required",
          body: (
            <p>
              KYC is required by anti-money-laundering and financial compliance rules before
              investment actions can be fully enabled.
            </p>
          ),
        },
        {
          id: "next",
          title: "Next steps",
          body: (
            <p>
              Full document upload and review status components will be added soon. For now, return
              to your <Link href="/dashboard" className="text-primary underline">dashboard overview</Link>.
            </p>
          ),
        },
      ]}
    />
  );
}
