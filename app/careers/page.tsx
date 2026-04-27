import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SimpleDocLayout } from "@/components/simple-doc-layout";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join the Nexiaa team.",
};

export default function CareersPage() {
  return (
    <SimpleDocLayout
      title="Careers"
      description="We are building tools for private-market investing. Roles will be posted here as we grow."
    >
      <p>
        There are no open roles listed at the moment. When we hire, you will find engineering,
        product, compliance, and operations positions on this page.
      </p>
      <p>
        In the meantime, you can reach us through{" "}
        <Link href="/contact" className="font-medium text-foreground underline underline-offset-4">
          contact
        </Link>{" "}
        with a CV or portfolio link.
      </p>
      <div className="pt-4">
        <Button asChild variant="outline">
          <Link href="/contact">Get in touch</Link>
        </Button>
      </div>
    </SimpleDocLayout>
  );
}
