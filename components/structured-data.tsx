import { SITE_NAME } from "@/lib/brand";
import { getStructuredDataStats } from "@/lib/services/structured-data";

export async function OrganizationStructuredData() {
  const stats = await getStructuredDataStats();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: SITE_NAME,
    description:
      "Private-market investment platform with structured listings, transparent fees, and comprehensive dashboards",
    url: baseUrl,
    logo: `${baseUrl}/icon-512.svg`,
    sameAs: [
      // Add your social media URLs here
      // "https://twitter.com/yourhandle",
      // "https://linkedin.com/company/yourcompany",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      availableLanguage: ["English", "French"],
    },
    aggregateRating:
      stats.totalReviews > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: stats.averageRating.toFixed(1),
            reviewCount: stats.totalReviews,
            bestRating: "5",
            worstRating: "1",
          }
        : undefined,
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      value: "10-50",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export async function WebsiteStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: baseUrl,
    description:
      "Private-market investment platform with structured listings, transparent fees, and comprehensive dashboards",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/campaigns?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export async function InvestmentPlatformStructuredData() {
  const stats = await getStructuredDataStats();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Investment Platform",
    provider: {
      "@type": "FinancialService",
      name: SITE_NAME,
      url: baseUrl,
    },
    areaServed: {
      "@type": "Place",
      name: "Cameroon",
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: baseUrl,
      serviceType: "Online",
    },
    offers:
      stats.activeCampaigns > 0
        ? {
            "@type": "AggregateOffer",
            offerCount: stats.activeCampaigns,
            priceCurrency: "XAF",
            lowPrice: (stats.minInvestment / 100).toFixed(0),
            highPrice: (stats.maxInvestment / 100).toFixed(0),
          }
        : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export async function CampaignStructuredData({
  campaign,
}: {
  campaign: {
    id: string;
    title: string;
    summary: string;
    goalAmount: number;
    raisedAmount: number;
    currency: string;
    coverImageUrl?: string | null;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
  };
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const campaignUrl = `${baseUrl}/campaigns/${campaign.slug}`;

  // Get campaign-specific reviews if available
  const { db } = await import("@/lib/db");
  const { campaignReviews, campaigns } = await import("@/lib/db/schema");
  const { eq, avg, count } = await import("drizzle-orm");

  let avgRating = 4.5;
  let reviewCount = 0;

  try {
    const [reviewStats] = await db
      .select({
        avgRating: avg(campaignReviews.rating),
        count: count(),
      })
      .from(campaignReviews)
      .where(eq(campaignReviews.campaignId, campaign.id));

    if (reviewStats) {
      avgRating = Number(reviewStats.avgRating ?? 4.5);
      reviewCount = reviewStats.count ?? 0;
    }
  } catch (error) {
    console.error("Error fetching campaign reviews:", error);
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: campaign.title,
    description: campaign.summary,
    image: campaign.coverImageUrl || `${baseUrl}/og-image.svg`,
    url: campaignUrl,
    offers: {
      "@type": "Offer",
      priceCurrency: campaign.currency || "XAF",
      price: (campaign.goalAmount / 100).toFixed(2),
      availability: "https://schema.org/InStock",
      url: campaignUrl,
    },
    aggregateRating:
      reviewCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: avgRating.toFixed(1),
            reviewCount: reviewCount.toString(),
          }
        : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function BreadcrumbStructuredData({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
