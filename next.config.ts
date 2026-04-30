import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/dashboard/kyc", destination: "/kyc", permanent: false }];
  },
};

export default nextConfig;
