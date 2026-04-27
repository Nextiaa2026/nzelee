import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SimpleDocLayout } from "@/components/simple-doc-layout";

export const metadata: Metadata = {
  title: "About",
  description: "What Nexiaa is and who it is for.",
};

export default function AboutPage() {
  return (
    <SimpleDocLayout
      title="About Nexiaa"
      description="Private-market access with transparent workflows, modern tooling, and compliance-first operations."
    >
      <p>
        Nexiaa was built to make private-market investing feel clear and modern. We combine
        structured offerings, transparent reporting, and clean onboarding so investors can focus on
        decisions, not paperwork.
      </p>
      <h2>Our mission</h2>
      <p>
        Give investors a practical way to access vetted opportunities while preserving strong
        compliance controls, clear disclosures, and reliable operational workflows for teams.
      </p>
      <h2>What we are building</h2>
      <ul>
        <li>Structured listings with straightforward terms and status tracking</li>
        <li>Investor dashboards for investments, transactions, and withdrawals</li>
        <li>Admin tooling for campaign management, moderation, and support workflows</li>
        <li>Identity and onboarding checkpoints designed for regulatory requirements</li>
      </ul>
      <h2>Our principles</h2>
      <ul>
        <li>
          <strong className="text-foreground">Clarity first:</strong> users should understand
          terms, risk, and status at a glance.
        </li>
        <li>
          <strong className="text-foreground">Compliance by design:</strong> KYC, verification,
          and policy controls are part of the product, not afterthoughts.
        </li>
        <li>
          <strong className="text-foreground">Operational transparency:</strong> auditability and
          clear activity trails matter for both investors and operators.
        </li>
      </ul>
      <h2>Leadership</h2>
      <p>
        Our team combines product, engineering, finance, and compliance experience from fast-growth
        technology and regulated financial environments. We are building Nexiaa for long-term trust
        and sustainable scale.
      </p>
      <h2>Get started</h2>
      <p>Create an account to explore opportunities, or sign in if you already have one.</p>
      <div className="flex flex-wrap gap-3 pt-2">
        <Button asChild>
          <Link href="/register">Register</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/login">Log in</Link>
        </Button>
      </div>
    </SimpleDocLayout>
  );
}
