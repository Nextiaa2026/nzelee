# Structured Data Usage Guide

This guide shows how to use the structured data components throughout the application.

## Available Components

### 1. OrganizationStructuredData (Global)

Already included in `app/layout.tsx`. Provides organization-level information.

**Features**:

- Dynamic aggregate ratings based on investor count
- Contact information
- Logo and branding
- Social media links (when configured)

**No action needed** - automatically included on all pages.

---

### 2. WebsiteStructuredData (Global)

Already included in `app/layout.tsx`. Provides website-level search functionality.

**Features**:

- Search action for campaign discovery
- Site-wide metadata

**No action needed** - automatically included on all pages.

---

### 3. InvestmentPlatformStructuredData (Optional)

Add to homepage or main landing pages for investment platform information.

**Usage**:

```tsx
import { InvestmentPlatformStructuredData } from "@/components/structured-data";

export default async function HomePage() {
  return (
    <>
      <InvestmentPlatformStructuredData />
      {/* Your page content */}
    </>
  );
}
```

**Features**:

- Active campaign offers
- Service availability
- Price ranges

---

### 4. CampaignStructuredData (Campaign Pages)

Add to individual campaign detail pages.

**Usage**:

```tsx
import { CampaignStructuredData } from "@/components/structured-data";

export default async function CampaignPage({
  params,
}: {
  params: { slug: string };
}) {
  const campaign = await getCampaignBySlug(params.slug);

  return (
    <>
      <CampaignStructuredData campaign={campaign} />
      {/* Your campaign content */}
    </>
  );
}
```

**Required campaign properties**:

```typescript
{
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
}
```

---

### 5. BreadcrumbStructuredData (Navigation)

Add to any page with hierarchical navigation.

**Usage**:

```tsx
import { BreadcrumbStructuredData } from "@/components/structured-data";

export default function CampaignPage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Campaigns", url: "/campaigns" },
    { name: "Campaign Title", url: "/campaigns/campaign-slug" },
  ];

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbs} />
      {/* Your page content */}
    </>
  );
}
```

---

## Implementation Examples

### Example 1: Campaign Detail Page

```tsx
// app/campaigns/[slug]/page.tsx
import {
  CampaignStructuredData,
  BreadcrumbStructuredData,
} from "@/components/structured-data";
import { getCampaignBySlug } from "@/lib/services/campaigns";

export default async function CampaignDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const campaign = await getCampaignBySlug(params.slug);

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Campaigns", url: "/campaigns" },
    { name: campaign.title, url: `/campaigns/${campaign.slug}` },
  ];

  return (
    <>
      <CampaignStructuredData campaign={campaign} />
      <BreadcrumbStructuredData items={breadcrumbs} />

      <main>
        <h1>{campaign.title}</h1>
        <p>{campaign.summary}</p>
        {/* Rest of campaign content */}
      </main>
    </>
  );
}
```

### Example 2: Homepage with Platform Info

```tsx
// app/page.tsx
import { InvestmentPlatformStructuredData } from "@/components/structured-data";

export default async function HomePage() {
  return (
    <>
      <InvestmentPlatformStructuredData />

      <main>
        <h1>Welcome to Nzelle</h1>
        {/* Homepage content */}
      </main>
    </>
  );
}
```

### Example 3: About Page with Breadcrumbs

```tsx
// app/about/page.tsx
import { BreadcrumbStructuredData } from "@/components/structured-data";

export default function AboutPage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
  ];

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbs} />

      <main>
        <h1>About Nzelle</h1>
        {/* About content */}
      </main>
    </>
  );
}
```

---

## Testing Structured Data

### Google Rich Results Test

1. Visit: https://search.google.com/test/rich-results
2. Enter your page URL or paste the HTML
3. Check for errors and warnings

### Schema.org Validator

1. Visit: https://validator.schema.org/
2. Paste your page HTML or URL
3. Verify schema markup is correct

### Chrome DevTools

1. Open DevTools
2. Go to Elements tab
3. Search for `<script type="application/ld+json">`
4. Verify JSON structure

---

## Best Practices

### 1. Always Include Breadcrumbs

Breadcrumbs improve search result display and user navigation:

```tsx
<BreadcrumbStructuredData items={breadcrumbs} />
```

### 2. Use Campaign Schema on Detail Pages

Individual campaign pages should include product schema:

```tsx
<CampaignStructuredData campaign={campaign} />
```

### 3. Keep URLs Consistent

Ensure URLs in structured data match actual page URLs:

```tsx
// ✅ Good
{ name: "Campaign", url: "/campaigns/my-campaign" }

// ❌ Bad
{ name: "Campaign", url: "/campaign/my-campaign" } // Different path
```

### 4. Provide Complete Data

Always provide all required fields to avoid validation errors:

```tsx
// ✅ Good - All required fields
<CampaignStructuredData
  campaign={{
    id: "123",
    title: "My Campaign",
    summary: "Description",
    goalAmount: 100000,
    raisedAmount: 50000,
    currency: "USD",
    slug: "my-campaign",
    createdAt: new Date(),
    updatedAt: new Date(),
  }}
/>

// ❌ Bad - Missing required fields
<CampaignStructuredData
  campaign={{
    title: "My Campaign",
    // Missing other required fields
  }}
/>
```

### 5. Update on Content Changes

When campaign data changes, the structured data updates automatically on next page load since it's fetched from the database.

---

## Troubleshooting

### Issue: Structured data not appearing

**Solution**: Ensure the component is placed inside the page component, not in a client component.

```tsx
// ✅ Good - Server component
export default async function Page() {
  return <CampaignStructuredData campaign={campaign} />;
}

// ❌ Bad - Client component
("use client");
export default function Page() {
  return <CampaignStructuredData campaign={campaign} />;
}
```

### Issue: Database query errors

**Solution**: The service includes error handling and returns default values. Check server logs for database connection issues.

### Issue: Validation errors in Google Rich Results Test

**Solution**:

1. Check all required fields are provided
2. Ensure URLs are absolute (include domain)
3. Verify date formats are valid ISO strings
4. Check numeric values are numbers, not strings

---

## Performance Considerations

### Caching

For high-traffic sites, consider caching the structured data stats:

```typescript
// lib/services/structured-data.ts
import { cache } from "react";

export const getStructuredDataStats = cache(async () => {
  // Database queries...
});
```

Or use Redis:

```typescript
import { redis } from "@/lib/redis";

export async function getStructuredDataStats() {
  const cached = await redis.get("structured-data-stats");
  if (cached) return JSON.parse(cached);

  const stats = await fetchFromDatabase();
  await redis.set("structured-data-stats", JSON.stringify(stats), "EX", 3600);

  return stats;
}
```

### Database Indexes

Ensure these indexes exist for optimal query performance:

- `campaigns.status` - For filtering active campaigns
- `pledges.backer_id` - For counting unique investors

---

## Future Enhancements

### FAQ Schema

For help and FAQ pages:

```typescript
export function FAQStructuredData({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
```

### Review Schema

For campaign reviews:

```typescript
export function ReviewStructuredData({ reviews }: { reviews: Array<Review> }) {
  // Implementation...
}
```

### Event Schema

For campaign launches:

```typescript
export function EventStructuredData({ event }: { event: CampaignEvent }) {
  // Implementation...
}
```
