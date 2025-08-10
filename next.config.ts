import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    cacheComponents: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "utfs.io",
      },
    ],
  },
};

export default nextConfig;
