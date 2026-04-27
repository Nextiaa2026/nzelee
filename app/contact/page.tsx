import type { Metadata } from "next";

import { ContactForm } from "@/components/forms/contact-form";
import { SimpleDocLayout } from "@/components/simple-doc-layout";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach the Nexiaa team.",
};

export default function ContactPage() {
  return (
    <SimpleDocLayout
      title="Contact us"
      description="Send a message and we will get back to you as soon as we can."
    >
      <p>
        For legal notices related to the Terms or Privacy Policy, include &quot;Legal&quot; in the
        subject line. This form is a demo; wire it to your support inbox or CRM when ready.
      </p>
      <div className="pt-4">
        <ContactForm className="max-w-md" />
      </div>
    </SimpleDocLayout>
  );
}
