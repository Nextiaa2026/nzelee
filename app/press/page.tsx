import type { Metadata } from "next";
import Link from "next/link";

import { SimpleDocLayout } from "@/components/simple-doc-layout";

export const metadata: Metadata = {
  title: "Press",
  description: "Press resources and media contact for Nexiaa.",
};

export default function PressPage() {
  return (
    <SimpleDocLayout
      title="Press"
      description="Media kit and announcements will appear here. For press inquiries, use the contact form."
    >
      <h2>Media contact</h2>
      <p>
        Please email your request through our{" "}
        <Link href="/contact" className="font-medium text-foreground underline underline-offset-4">
          contact page
        </Link>{" "}
        and include &quot;Press&quot; in the subject line.
      </p>
      <h2>Brand</h2>
      <p>
        Logo and brand guidelines can be shared on request once a formal press relationship is
        established.
      </p>
    </SimpleDocLayout>
  );
}
