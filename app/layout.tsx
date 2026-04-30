import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";

import { GlobalSiteChrome } from "@/components/global-site-chrome";
import { Providers } from "@/components/providers";
import { PWAInstaller } from "@/components/pwa-installer";
import {
  OrganizationStructuredData,
  WebsiteStructuredData,
} from "@/components/structured-data";
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
  keywords: [
    "investment platform",
    "private market",
    "crowdfunding",
    "real estate investment",
    "campaign funding",
    "investor dashboard",
    "financial technology",
    "fintech",
    "investment opportunities",
    "portfolio management",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE_NAME} — Private-market investing`,
    description: `${SITE_NAME} is a private-market investment platform—structured listings, transparent fees, and dashboards for investors and administrators.`,
    url: "/",
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} Platform`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Private-market investing`,
    description: `${SITE_NAME} is a private-market investment platform—structured listings, transparent fees, and dashboards for investors and administrators.`,
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE_NAME,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#0b2d24",
};

export default async function RootLayout({
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
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
        <meta name="apple-mobile-web-app-title" content="Nzelle" />
        <meta name="mobile-web-app-capable" content="yes" />
        <OrganizationStructuredData />
        <WebsiteStructuredData />
      </head>
      <body className={`flex min-h-full flex-col font-sans ${inter.className}`}>
        <Providers>
          <GlobalSiteChrome>{children}</GlobalSiteChrome>
          <PWAInstaller />
        </Providers>
      </body>
    </html>
  );
}
