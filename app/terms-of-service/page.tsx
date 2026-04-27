import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing use of the Nexiaa platform.",
};

export default function TermsOfServicePage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      updatedAt="April 2026"
      intro={
        <p>
          These Terms govern access to and use of Nexiaa services. By creating an account or using
          the platform, you agree to these Terms.
        </p>
      }
      sections={[
        {
          id: "eligibility",
          title: "Eligibility and accounts",
          body: (
            <p>
              You must be legally capable of entering a contract in your jurisdiction and must keep
              your account credentials secure.
            </p>
          ),
        },
        {
          id: "risk",
          title: "Investment risk disclosure",
          body: (
            <p>
              All investments involve risk, including loss of principal. Nothing on Nexiaa is
              personalized legal, tax, or investment advice.
            </p>
          ),
        },
        {
          id: "acceptable-use",
          title: "Acceptable use",
          body: (
            <ul className="ml-5 list-disc space-y-2">
              <li>No unlawful, fraudulent, or abusive activity.</li>
              <li>No attempts to bypass security controls or rate limits.</li>
              <li>No misrepresentation of identity, eligibility, or KYC information.</li>
            </ul>
          ),
        },
        {
          id: "changes",
          title: "Changes and updates",
          body: (
            <p>
              We may update these Terms as services evolve. Material updates will be communicated
              in-app or via email where required.
            </p>
          ),
        },
      ]}
    />
  );
}
