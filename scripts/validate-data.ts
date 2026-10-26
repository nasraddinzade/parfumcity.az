/**
 * Validates data/products.json and data/brands.json against the zod schemas.
 * Runs once before `next build` (see the `prebuild` script) so that the app
 * can import the JSON files as typed data without parsing them at runtime.
 */
import { readFileSync } from "node:fs";
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
}

if (errors.length > 0) {
  console.error("Data validation failed:\n" + errors.map((e) => "  - " + e).join("\n"));
  process.exit(1);
}

console.log("Data OK: " + products.length + " products, " + brands.length + " brands");
