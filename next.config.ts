
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["placehold.co"],
    dangerouslyAllowSVG: true,
    // remotePatterns: [new URL('https://picsum.photos/**')],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'smart-ticket-services.onrender.com',
        port: '',
        pathname: '/storage/**',
      },
    ],
  },
};

export default nextConfig;
