/**
 * Product photos.
 *
 * `product-images.json` maps every product slug to a 4:5 WebP under
 * /public/images/p. The photos come from the boutique's own Wolt listing and,
 * where Wolt had none, from the brands' official websites (see
 * public/images/CREDITS.md). Products without any photo were removed from the
 * catalogue.
 *
 * Priority when rendering a product:
 *   1. product.image from data/products.json (null today)
 *   2. productImages[product.slug]
 *   3. brandImages[product.brandSlug]
 *   4. the code-drawn flacon (components/product/product-image.tsx), also used
 *      when a photo fails to load
 *
 * To use the boutique's own photography later, drop files into /public/images
 * and point the slugs at them here, or set absolute URLs and add their host to
 * `imageHosts`, which feeds `images.remotePatterns` in next.config.ts.
 */
import productImageMap from "@/data/product-images.json";

export const productImages: Record<string, string> = productImageMap;

/** Optional shared photo per brand; empty while every product has its own. */
export const brandImages: Record<string, string> = {};

export { imageHosts } from "@/data/image-hosts";

export type ResolvedImage = { kind: "product" | "brand"; src: string } | { kind: "placeholder"; src: null };

export function resolveProductImage(product: { slug: string; brandSlug: string; image: string | null }): ResolvedImage {
  const own = product.image ?? productImages[product.slug];
  if (own) return { kind: "product", src: own };
  const brand = brandImages[product.brandSlug];
  if (brand) return { kind: "brand", src: brand };
  return { kind: "placeholder", src: null };
}

export function resolveBrandImage(brandSlug: string): string | null {
  return brandImages[brandSlug] ?? null;
}
