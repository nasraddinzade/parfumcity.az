/**
 * Image map for products and brands.
 *
 * Priority when rendering a product:
 *   1. productImages[product.slug]
 *   2. brandImages[product.brandSlug]
 *   3. generated placeholder (components/product/product-image.tsx)
 *
 * A value can be a path under /public (e.g. "/images/products/x.jpg") or an
 * absolute https URL. Every external host must be listed in `imageHosts`,
 * which feeds `images.remotePatterns` in next.config.ts. External hosts often
 * refuse hotlinking, so <ProductImage> falls back to the drawn flacon when a
 * request fails.
 *
 * The photos shipped with the concept are freely licensed placeholders from
 * Wikimedia Commons (see public/images/CREDITS.md). Replace them with the
 * boutique's own photography when it arrives.
 */

export const productImages: Record<string, string> = {
  "armani-acqua-di-gio-edt-30": "/images/products/armani-acqua-di-gio.jpg",
  "armani-acqua-di-gio-edt-50": "/images/products/armani-acqua-di-gio.jpg",
  "guerlain-shalimar-edp-50": "/images/products/guerlain-shalimar.jpg",
  "guerlain-shalimar-edp-90": "/images/products/guerlain-shalimar.jpg",
};

export const brandImages: Record<string, string> = {
  armani: "/images/brands/armani.jpg",
  byredo: "/images/brands/byredo.jpg",
  guerlain: "/images/products/guerlain-shalimar.jpg",
  prada: "/images/brands/prada.jpg",
};

/**
 * External hosts allowed for next/image. Add the host of any absolute URL you
 * put in the maps above (a CDN, the boutique's own storage, Instagram proxy…).
 */
export const imageHosts: readonly string[] = ["upload.wikimedia.org"];

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
