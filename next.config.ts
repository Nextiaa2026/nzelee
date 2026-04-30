import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
  reloadOnOnline: true,
});

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/dashboard/kyc", destination: "/kyc", permanent: false },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  // Silence Turbopack error when using webpack-based PWA plugin
  turbopack: {},
};

export default withSerwist(nextConfig);

