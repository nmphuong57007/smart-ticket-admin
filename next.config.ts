import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000", // Backend Laravel
      },
      {
        protocol: "https",
        hostname: "your-api-domain.com",
      },
    ],
  },
};

export default nextConfig;
