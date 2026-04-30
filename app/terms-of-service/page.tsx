import type { Metadata } from "next";

import { LegalLayout } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Rules for using Zeller's campaign marketplace, accounts, and investor features.",
};

export default function TermsOfServicePage() {
  return (
    <LegalLayout title="Terms of Service" updated="April 2026">
      <p>
        These Terms govern your use of Zeller—the product you use to discover{" "}
        <strong>campaigns</strong>, place <strong>pledges</strong>, manage your
        account, and (for creators) publish and operate listings. By registering
        or continuing to use the platform, you agree to these Terms and to any
        policies linked from them.
      </p>

      <h2>Eligibility and accounts</h2>
      <p>
        You must be legally capable of entering a contract in your jurisdiction
        and must keep your account credentials secure.
      </p>

      <h2>Investment risk disclosure</h2>
      <p>
        All investments involve risk, including loss of principal. Nothing on
        Zeller is personalized legal, tax, or investment advice.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>No unlawful, fraudulent, or abusive activity.</li>
        <li>No attempts to bypass security controls or rate limits.</li>
        <li>
          No misrepresentation of identity, eligibility, or KYC information.
        </li>
      </ul>

      <h2>Changes and updates</h2>
      <p>
        We may update these Terms as services evolve. Material updates will be
        communicated in-app or via email where required.
      </p>
    </LegalLayout>
  );
}
