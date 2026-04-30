import type { Metadata } from "next";

import { LegalLayout } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Zeller handles data for accounts, campaigns, pledges, and verification.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="April 2026">
      <p>
        Zeller connects <strong>creators</strong> and <strong>investors</strong>{" "}
        around crowdfunding campaigns. This policy explains what we
        collect—including account, campaign, pledge, and verification data—how
        we use it to run the service, and the choices you may have.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>
          Account and profile details you provide when you register or update
          settings.
        </li>
        <li>
          Campaign and pledge information you create or submit (titles,
          descriptions, amounts, status, and related metadata).
        </li>
        <li>
          KYC and verification materials where required for eligibility or
          regulations.
        </li>
        <li>
          Technical usage, security logs, and device information needed to
          operate safely.
        </li>
        <li>
          Results from trusted vendors for fraud prevention, payments, or
          identity checks.
        </li>
      </ul>

      <h2>How we use information</h2>
      <p>
        We use data to operate services, verify users, process activity, detect
        fraud, comply with legal obligations, and improve product quality.
      </p>

      <h2>Sharing and retention</h2>
      <p>
        Data may be shared with operational providers and regulators where
        required. We retain information based on legal, operational, and
        regulatory obligations.
      </p>

      <h2>Your rights</h2>
      <p>
        Depending on jurisdiction, you may request access, correction, deletion,
        or object to certain processing by contacting support.
      </p>
    </LegalLayout>
  );
}
