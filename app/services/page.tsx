import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SimpleDocLayout } from "@/components/simple-doc-layout";

export const metadata: Metadata = {
  title: "Services",
  description: "What Nexiaa offers investors and operators.",
};

export default function ServicesPage() {
  return (
    <SimpleDocLayout
      title="Services"
      description="Platform capabilities for discovery, diligence, and ongoing portfolio management."
    >
      <h2>For investors</h2>
      <ul>
        <li>Structured listings and transparent fee schedules</li>
        <li>Dashboards for commitments, transactions, and withdrawals</li>
        <li>Identity and eligibility workflows where required</li>
      </ul>
      <h2>For administrators</h2>
      <ul>
        <li>Campaign and pledge management</li>
        <li>User administration and reporting</li>
      </ul>
      <div className="flex flex-wrap gap-3 pt-4">
        <Button asChild>
          <Link href="/register">Create an account</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact">Talk to us</Link>
        </Button>
      </div>
    </SimpleDocLayout>
  );
}
