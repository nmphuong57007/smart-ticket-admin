
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["placehold.co"],
    dangerouslyAllowSVG: true,
    remotePatterns: [new URL('https://picsum.photos/**')],
  },
};

export default nextConfig;
