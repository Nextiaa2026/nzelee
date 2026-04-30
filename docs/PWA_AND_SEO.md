# PWA and SEO Implementation

This document describes the Progressive Web App (PWA) and SEO optimizations implemented in the Nzelle platform.

## Progressive Web App (PWA)

### Features Implemented

1. **Service Worker** (`public/sw.js`)
   - Offline caching strategy
   - Cache-first with network fallback
   - Automatic cache versioning and cleanup
   - Offline page support

2. **Web App Manifest** (`public/manifest.json`)
   - App name: Nzelle
   - Theme color: #0F8261 (deep green)
   - Display mode: standalone
   - Icons: 192x192 and 512x512 (SVG format)
   - Screenshots for app stores
   - Categories: finance, business

3. **Mobile Bottom Navigation** (`components/mobile-bottom-nav.tsx`)
   - 5 navigation tabs: Home, Explore, Markets, Saved, Account
   - Active state indicators
   - iOS safe-area support
   - Hidden on auth and admin pages

4. **PWA Installer** (`components/pwa-installer.tsx`)
   - Automatic service worker registration
   - Production-only activation
   - Error handling and logging

### iOS Support

- Apple touch icon configured
- Mobile web app capable meta tags
- Status bar styling
- Safe area insets for notched devices

### Testing PWA

1. **Development**:

   ```bash
   npm run build
   npm start
   ```

2. **Chrome DevTools**:
   - Open DevTools > Application tab
   - Check Manifest, Service Workers, and Cache Storage
   - Use Lighthouse to audit PWA score

3. **Mobile Testing**:
   - iOS: Add to Home Screen from Safari
   - Android: Install prompt should appear automatically

## SEO Optimization

### Structured Data (Schema.org)

Dynamic structured data components fetch real-time statistics from the database:

1. **OrganizationStructuredData**
   - Type: FinancialService
   - Includes aggregate ratings based on investor count
   - Contact information
   - Logo and branding

2. **WebsiteStructuredData**
   - Type: WebSite
   - Search action for campaign discovery
   - Site-wide metadata

3. **InvestmentPlatformStructuredData**
   - Type: Service
   - Active campaign offers
   - Service availability and channels

4. **CampaignStructuredData**
   - Type: Product
   - Individual campaign details
   - Pricing and availability
   - Ratings and reviews

5. **BreadcrumbStructuredData**
   - Type: BreadcrumbList
   - Navigation hierarchy
   - Improves search result display

### Meta Tags

Comprehensive meta tags configured in `app/layout.tsx`:

- **OpenGraph**: Social media sharing (Facebook, LinkedIn)
- **Twitter Cards**: Enhanced Twitter previews
- **Robots**: Search engine crawling instructions
- **Viewport**: Mobile-responsive settings
- **Theme Color**: Brand color for browser UI

### Sitemap

Dynamic sitemap at `/sitemap.xml` includes:

- Homepage
- Campaign listing
- Static pages (About, Services, Contact, etc.)
- Legal pages (Terms, Privacy, Cookie Policy)
- Change frequency and priority hints

### Robots.txt

Located at `public/robots.txt`:

- Allows all crawlers
- Disallows private areas (admin, dashboard, auth)
- Sitemap reference

### Social Media Images

- **OG Image**: `public/og-image.svg` (1200x630)
- Used for social media previews
- Includes brand colors and messaging

## Database Integration

The structured data service (`lib/services/structured-data.ts`) fetches:

- Total campaigns count
- Active campaigns (LIVE status)
- Total unique investors
- Total amount raised
- Average rating from campaign reviews
- Total review count
- Min and max investment amounts for price ranges

**Primary Currency**: XAF (Central African CFA franc)

This ensures search engines see accurate, up-to-date information about the platform with real data from the database.

## Assets

### Generated Assets

Run these scripts to regenerate placeholder assets:

```bash
# Generate PWA icons
node scripts/generate-pwa-icons.js

# Generate PWA screenshots
node scripts/generate-pwa-screenshots.js
```

### Production Assets

For production, replace these placeholder SVG files with professional designs:

- `public/icon-192.svg` → `public/icon-192.png`
- `public/icon-512.svg` → `public/icon-512.png`
- `public/screenshot-mobile.svg` → `public/screenshot-mobile.png`
- `public/screenshot-desktop.svg` → `public/screenshot-desktop.png`
- `public/og-image.svg` → `public/og-image.png`

Update references in:

- `public/manifest.json`
- `app/layout.tsx`
- `components/structured-data.tsx`

## Performance Considerations

1. **Structured Data Caching**
   - Database queries are executed on each page load
   - Consider implementing Redis caching for high-traffic sites
   - Stats update in real-time for accurate SEO data

2. **Service Worker Updates**
   - Update `CACHE_NAME` in `public/sw.js` when deploying
   - Old caches are automatically cleaned up
   - Users get new version on next visit

3. **Mobile Performance**
   - Bottom navigation uses CSS transforms for smooth animations
   - Safe area insets prevent content overlap on notched devices
   - Minimal JavaScript for fast load times

## Environment Variables

Required environment variable:

```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

Used for:

- Canonical URLs
- Structured data URLs
- Sitemap generation
- Social media previews

## Browser Support

- **PWA**: Chrome, Edge, Safari 11.1+, Firefox
- **Service Workers**: All modern browsers
- **Structured Data**: All search engines (Google, Bing, etc.)
- **Mobile Navigation**: iOS 11+, Android 5+

## Monitoring

### Google Search Console

1. Submit sitemap: `https://yourdomain.com/sitemap.xml`
2. Monitor structured data errors
3. Check mobile usability
4. Track search performance

### Lighthouse Audits

Run regular audits for:

- PWA score (target: 90+)
- SEO score (target: 95+)
- Performance score
- Accessibility score

### Analytics

Track PWA metrics:

- Install rate
- Offline usage
- Service worker errors
- Cache hit rate

## Future Enhancements

1. **Push Notifications**
   - Campaign updates
   - Investment confirmations
   - KYC status changes

2. **Background Sync**
   - Offline form submissions
   - Queue investment actions

3. **Advanced Caching**
   - Dynamic content caching
   - Image optimization
   - API response caching

4. **Rich Snippets**
   - FAQ schema for help pages
   - Review schema for campaigns
   - Event schema for campaign launches
