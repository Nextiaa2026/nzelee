import type { MetadataRoute } from "next";

import { SITE_NAME } from "@/lib/brand";
import { BRAND_ICON_FILES, BRAND_PWA_SCREENSHOTS } from "@/lib/brand-logos";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} - Investment Platform`,
    short_name: SITE_NAME,
    description:
      "Private-market investment platform with structured listings, transparent fees, and comprehensive dashboards",
    start_url: "/",
    display: "standalone",
    background_color: "#0b2d24",
    theme_color: "#0b2d24",
    orientation: "portrait-primary",
    icons: [
      {
        src: BRAND_ICON_FILES.pwa192,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: BRAND_ICON_FILES.pwa512,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: BRAND_ICON_FILES.pwa512,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["finance", "business"],
    screenshots: [
      {
        src: BRAND_PWA_SCREENSHOTS.narrow,
        sizes: "390x844",
        type: "image/png",
        form_factor: "narrow",
        label: `${SITE_NAME} on mobile`,
      },
      {
        src: BRAND_PWA_SCREENSHOTS.wide,
        sizes: "1920x1080",
        type: "image/png",
        form_factor: "wide",
        label: `${SITE_NAME} on desktop`,
      },
    ],
  };
}
