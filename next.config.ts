import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // experimental: {
  //   dynamicIO: true,
  // },
  images: {
    remotePatterns: [
      {
        hostname: "utfs.io",
      },
    ],
  },
};

export default nextConfig;
