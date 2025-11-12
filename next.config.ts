import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,

    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],

    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
