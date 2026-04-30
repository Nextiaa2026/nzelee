import type { Metadata } from "next";

import { LegalLayout } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Cookies and similar tech on Zeller for sign-in, campaigns, and analytics.",
};

export default function CookiePolicyPage() {
  return (
    <LegalLayout title="Cookie Policy" updated="April 2026">
      <p>
        This policy describes how Zeller uses cookies and similar technologies
        to keep sessions secure, remember preferences, and understand how the
        campaign experience is used—so we can improve performance without
        sacrificing core functionality.
      </p>

      <h2>What are cookies?</h2>
      <p>
        Cookies are small text files placed on your device to support
        authentication, functionality, analytics, and security.
      </p>

      <h2>Types of cookies we use</h2>
      <h3>Strictly necessary</h3>
      <p>Required for sign-in, security, and core campaign flows.</p>

      <h3>Functional</h3>
      <p>Remember settings and UI preferences.</p>

      <h3>Analytics</h3>
      <p>Measure usage trends and reliability (where enabled).</p>

      <h2>Managing cookies</h2>
      <p>
        You can control cookies through browser settings. Disabling required
        cookies may impact essential site functionality.
      </p>
    </LegalLayout>
  );
}
