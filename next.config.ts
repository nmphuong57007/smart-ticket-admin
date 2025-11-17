import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["placehold.co"],
    dangerouslyAllowSVG: true,
    // remotePatterns: [new URL('https://picsum.photos/**')],
     remotePatterns: [
      new URL('http://127.0.0.1:8000/storage/posters/**'),

    ],
  },
};

export default nextConfig;
