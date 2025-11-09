import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["placehold.co"],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
