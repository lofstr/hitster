import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "i.scdn.co", // Spotify images
      "mosaic.scdn.co", // Spotify playlist mosaics
      "lineup-images.scdn.co", // Spotify artist images
    ],
  },
};

export default nextConfig;
