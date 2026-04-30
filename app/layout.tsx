import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";

import { GlobalSiteChrome } from "@/components/global-site-chrome";
import { Providers } from "@/components/providers";
import { SITE_NAME } from "@/lib/brand";
import "./globals.css";
/* Resolved by path so Turbopack can load the built CSS (package root import may not resolve). */
import "../node_modules/tw-animate-css/dist/tw-animate.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  adjustFontFallback: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Private-market investing`,
    template: `%s — ${SITE_NAME}`,
  },
  description: `${SITE_NAME} is a private-market investment platform—structured listings, transparent fees, and dashboards for investors and administrators.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className={`flex min-h-full flex-col font-sans ${inter.className}`}>
        <Providers>
          <GlobalSiteChrome>{children}</GlobalSiteChrome>
        </Providers>
      </body>
    </html>
  );
}
