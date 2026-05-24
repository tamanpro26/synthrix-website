import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.itch.zone" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "www.darkstargames.org" },
    ],
  },
};

export default nextConfig;
