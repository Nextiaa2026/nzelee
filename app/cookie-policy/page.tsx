import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How Nexiaa uses cookies and similar technologies.",
};

export default function CookiePolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Cookie Policy"
      updatedAt="April 2026"
      intro={
        <p>
          This Cookie Policy explains how Nexiaa uses cookies and similar tracking technologies and
          how you can manage your preferences.
        </p>
      }
      sections={[
        {
          id: "what",
          title: "What are cookies?",
          body: (
            <p>
              Cookies are small text files placed on your device to support authentication,
              functionality, analytics, and security.
            </p>
          ),
        },
        {
          id: "types",
          title: "Types of cookies we use",
          body: (
            <ul className="ml-5 list-disc space-y-2">
              <li><span className="font-medium text-foreground">Strictly necessary</span> - required for core platform use.</li>
              <li><span className="font-medium text-foreground">Functional</span> - remember settings and preferences.</li>
              <li><span className="font-medium text-foreground">Analytics</span> - measure usage trends and product performance.</li>
            </ul>
          ),
        },
        {
          id: "manage",
          title: "Managing cookies",
          body: (
            <p>
              You can control cookies through browser settings. Disabling required cookies may
              impact essential site functionality.
            </p>
          ),
        },
      ]}
    />
  );
}
