import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SimpleDocLayout } from "@/components/simple-doc-layout";

export const metadata: Metadata = {
  title: "Help center",
  description: "Help topics and support for Nexiaa.",
};

export default function HelpPage() {
  return (
    <SimpleDocLayout
      title="Help center"
      description="Quick answers to common platform, onboarding, and policy questions."
    >
      <h2>Frequently asked questions</h2>
      <ul>
        <li>
          <strong className="text-foreground">Who can invest on Nexiaa?</strong>
          <br />
          Nexiaa currently supports accredited investors, with identity checks completed during
          onboarding and before funding.
        </li>
        <li>
          <strong className="text-foreground">How long does setup take?</strong>
          <br />
          Creating an account usually takes minutes. Verification review is typically completed
          within one business day.
        </li>
        <li>
          <strong className="text-foreground">Can I skip KYC at onboarding?</strong>
          <br />
          Yes. You can defer KYC and complete it later from your dashboard before your first
          investment.
        </li>
        <li>
          <strong className="text-foreground">Where do I see transactions?</strong>
          <br />
          Use your dashboard transaction and investment pages for status, history, and payout
          records.
        </li>
        <li>
          <strong className="text-foreground">Are returns guaranteed?</strong>
          <br />
          No. All investments carry risk, including possible loss of principal.
        </li>
        <li>
          <strong className="text-foreground">Where can I read legal terms?</strong>
          <br />
          Review our{" "}
          <Link href="/terms-of-service" className="font-medium text-foreground underline underline-offset-4">
            Terms of Service
          </Link>
          ,{" "}
          <Link href="/privacy-policy" className="font-medium text-foreground underline underline-offset-4">
            Privacy Policy
          </Link>
          , and{" "}
          <Link href="/cookie-policy" className="font-medium text-foreground underline underline-offset-4">
            Cookie Policy
          </Link>
          .
        </li>
      </ul>
      <h2>Need more help?</h2>
      <p>Our team can help with onboarding, account, and product questions.</p>
      <div className="pt-2">
        <Button asChild>
          <Link href="/contact">Contact support</Link>
        </Button>
      </div>
    </SimpleDocLayout>
  );
}
