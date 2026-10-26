import type { NextConfig } from "next";
import { imageHosts } from "./data/images";

const ogFonts = ["./assets/fonts/*.woff"];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Open Graph routes read font files from disk; make sure serverless bundles include them.
  outputFileTracingIncludes: {
    "/[locale]/opengraph-image": ogFonts,
    "/[locale]/brendler/[brandSlug]/opengraph-image": ogFonts,
    "/[locale]/mehsul/[slug]/opengraph-image": ogFonts,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: imageHosts.map((hostname) => ({ protocol: "https" as const, hostname })),
  },
};

export default nextConfig;
