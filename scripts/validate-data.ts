/**
 * Validates data/products.json and data/brands.json against the zod schemas.
 * Runs once before `next build` (see the `prebuild` script) so that the app
 * can import the JSON files as typed data without parsing them at runtime.
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { productsSchema, brandsSchema } from "../lib/schemas";

const root = resolve(__dirname, "..");

function readJson(file: string): unknown {
  return JSON.parse(readFileSync(resolve(root, "data", file), "utf8"));
}

const products = productsSchema.parse(readJson("products.json"));
const brands = brandsSchema.parse(readJson("brands.json"));

const errors: string[] = [];

const slugs = new Set<string>();
for (const p of products) {
  if (slugs.has(p.slug)) errors.push("duplicate product slug: " + p.slug);
  slugs.add(p.slug);
}

const brandBySlug = new Map(brands.map((b) => [b.slug, b]));
const counts = new Map<string, number>();
for (const p of products) {
  const brand = brandBySlug.get(p.brandSlug);
  if (!brand) {
    errors.push("product " + p.slug + " references unknown brand " + p.brandSlug);
    continue;
  }
  if (brand.name !== p.brand) errors.push("product " + p.slug + " brand name mismatch");
  if (brand.segment !== p.segment) errors.push("product " + p.slug + " segment mismatch with brand");
  counts.set(p.brandSlug, (counts.get(p.brandSlug) ?? 0) + 1);
}
for (const b of brands) {
  const actual = counts.get(b.slug) ?? 0;
  if (actual !== b.count) errors.push("brand " + b.slug + " count " + b.count + " but " + actual + " products found");
  if (actual === 0) errors.push("brand " + b.slug + " has no products");
}

// Every product must have a photo, and every mapped file must exist.
const images = readJson("product-images.json") as Record<string, string>;
for (const p of products) {
  const src = p.image ?? images[p.slug];
  if (!src) errors.push("product " + p.slug + " has no photo");
  else if (src.startsWith("/") && !existsSync(resolve(root, "public", "." + src))) {
    errors.push("product " + p.slug + " photo file missing: " + src);
  }
}
for (const slug of Object.keys(images)) {
  if (!slugs.has(slug)) errors.push("photo mapped to unknown product " + slug);
}

// Texts quote these figures through {brands}/{products}/{min}/{max}; keep them in sync.
const stats = readJson("catalog-stats.json") as Record<string, number>;
const expected = {
  brands: brands.length,
  products: products.length,
  min: Math.min(...products.map((p) => p.priceAzn)),
  max: Math.max(...products.map((p) => p.priceAzn)),
};
for (const [k, v] of Object.entries(expected)) {
  if (stats[k] !== v) errors.push("catalog-stats.json " + k + " is " + stats[k] + " but the catalogue gives " + v);
}

if (errors.length > 0) {
  console.error("Data validation failed:\n" + errors.map((e) => "  - " + e).join("\n"));
  process.exit(1);
}

console.log("Data OK: " + products.length + " products, " + brands.length + " brands");
