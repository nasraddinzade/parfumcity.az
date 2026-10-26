import productsJson from "@/data/products.json";
import brandsJson from "@/data/brands.json";
import type { Brand, Concentration, Product } from "@/types/product";

// The JSON files are validated with zod once at build time (scripts/validate-data.ts),
// so here they are imported as already-typed data without any runtime parsing.
export const products: readonly Product[] = productsJson as Product[];
export const brands: readonly Brand[] = brandsJson as Brand[];

const productBySlug = new Map(products.map((p) => [p.slug, p]));
const brandBySlug = new Map(brands.map((b) => [b.slug, b]));
const productsByBrand = new Map<string, Product[]>();
for (const p of products) {
  const list = productsByBrand.get(p.brandSlug);
  if (list) list.push(p);
  else productsByBrand.set(p.brandSlug, [p]);
}

export function getProduct(slug: string): Product | undefined {
  return productBySlug.get(slug);
}

export function getBrand(slug: string): Brand | undefined {
  return brandBySlug.get(slug);
}

export function getBrandProducts(brandSlug: string): Product[] {
  return productsByBrand.get(brandSlug) ?? [];
}

/** Same fragrance (brand + name) in other volumes, sorted by volume. */
export function getVariants(product: Product): Product[] {
  return getBrandProducts(product.brandSlug)
    .filter((p) => p.name === product.name)
    .sort((a, b) => a.volumeMl - b.volumeMl);
}

/** Other fragrances from the same brand, excluding every volume of the given one. */
export function getSimilar(product: Product, limit = 4): Product[] {
  const seen = new Set<string>([product.name]);
  const out: Product[] = [];
  for (const p of getBrandProducts(product.brandSlug)) {
    if (seen.has(p.name)) continue;
    seen.add(p.name);
    out.push(p);
    if (out.length >= limit) break;
  }
  return out;
}

export function getPriceRange(list: readonly Product[] = products): { min: number; max: number } {
  let min = Number.POSITIVE_INFINITY;
  let max = 0;
  for (const p of list) {
    if (p.priceAzn < min) min = p.priceAzn;
    if (p.priceAzn > max) max = p.priceAzn;
  }
  return { min: list.length ? min : 0, max };
}

export const allVolumes: readonly number[] = [...new Set(products.map((p) => p.volumeMl))].sort((a, b) => a - b);

const concentrationOrder: readonly Concentration[] = ["EDP", "EDT", "ExDP", "Parfum", "Digər"];
export const allConcentrations: readonly Concentration[] = concentrationOrder.filter((c) =>
  products.some((p) => p.concentration === c),
);

export const brandsSorted: readonly Brand[] = [...brands].sort((a, b) => a.name.localeCompare(b.name, "en"));

/** Hand-picked slugs for the home page selection; every one is verified to exist. */
const FEATURED_SLUGS = [
  "byredo-gypsy-water-edp-100",
  "tom-ford-oud-wood-edp-50",
  "xerjoff-1861-naxos-edp-100",
  "guerlain-shalimar-edp-90",
  "hermes-terre-d-hermes-edt-100",
  "memo-paris-irish-leather-edp-75",
  "clive-christian-1872-feminine-50",
  "essential-parfums-bois-imperial-edp-100",
];

export const featuredProducts: readonly Product[] = FEATURED_SLUGS.map((s) => productBySlug.get(s)).filter(
  (p): p is Product => Boolean(p),
);

export const catalogStats = {
  brands: brands.length,
  products: products.length,
  ...getPriceRange(),
};
