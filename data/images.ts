/**
 * External image map.
 *
 * Priority when rendering a product:
 *   1. productImages[product.slug]
 *   2. brandImages[product.brandSlug]
 *   3. generated placeholder (components/product/product-image.tsx)
 *
 * Replace or extend these links with the boutique's own photos. Every host used
 * here must also be listed in `imageHosts`, which feeds `images.remotePatterns`
 * in next.config.ts.
 *
 * The current links point to freely licensed photographs on Wikimedia Commons
 * and are placeholders for the concept only.
 */

const commons = (hash: string, file: string, width = 1200) =>
  "https://upload.wikimedia.org/wikipedia/commons/thumb/" + hash + "/" + file + "/" + width + "px-" + file;

export const productImages: Record<string, string> = {
  "armani-acqua-di-gio-edt-30": commons("7/74", "Armani_acqua_di_Gio_M.jpg", 800),
  "armani-acqua-di-gio-edt-50": commons("7/74", "Armani_acqua_di_Gio_M.jpg", 800),
  "guerlain-shalimar-edp-50": commons("9/9c", "Shalimar.jpg", 1000),
  "guerlain-shalimar-edp-90": commons("9/9c", "Shalimar.jpg", 1000),
};

export const brandImages: Record<string, string> = {
  armani: commons("d/d3", "Acqua_di_gi%C3%B2_Bottles.jpg", 1000),
  byredo: commons("5/56", "Picture_of_Byredo_perfume.jpg", 1200),
  guerlain: commons("9/9c", "Shalimar.jpg", 1000),
  prada: commons("4/48", "Prada_Infusion_d%27Iris_Cedre.jpg", 1200),
};

/** Hosts allowed for next/image. Keep in sync with the links above. */
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
