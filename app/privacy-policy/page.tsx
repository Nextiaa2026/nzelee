import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Nexiaa collects, uses, and protects your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      updatedAt="April 2026"
      intro={
        <p>
          This policy describes what personal data we collect, how we use it, and what rights you
          may have.
        </p>
      }
      sections={[
        {
          id: "collect",
          title: "Information we collect",
          body: (
            <ul className="ml-5 list-disc space-y-2">
              <li>Account and profile details you provide.</li>
              <li>KYC and verification documents required for compliance.</li>
              <li>Technical usage, logs, and device information.</li>
              <li>Third-party vendor results for fraud and identity checks.</li>
            </ul>
          ),
        },
        {
          id: "use",
          title: "How we use information",
          body: (
            <p>
              We use data to operate services, verify users, process activity, detect fraud, comply
              with legal obligations, and improve product quality.
            </p>
          ),
        },
        {
          id: "share",
          title: "Sharing and retention",
          body: (
            <p>
              Data may be shared with operational providers and regulators where required. We retain
              information based on legal, operational, and regulatory obligations.
            </p>
          ),
        },
        {
          id: "rights",
          title: "Your rights",
          body: (
            <p>
              Depending on jurisdiction, you may request access, correction, deletion, or object to
              certain processing by contacting support.
            </p>
          ),
        },
      ]}
    />
  );
}
