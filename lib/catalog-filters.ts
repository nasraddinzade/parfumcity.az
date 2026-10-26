import type { Concentration, Product, Segment } from "@/types/product";
import { CONCENTRATIONS, SEGMENTS } from "@/types/product";

export const PAGE_SIZE = 24;

export type SortKey = "brand" | "price-asc" | "price-desc" | "name-asc";
export const SORT_KEYS: readonly SortKey[] = ["brand", "price-asc", "price-desc", "name-asc"];

export interface CatalogQuery {
  q: string;
  brands: string[];
  volumes: number[];
  concentrations: Concentration[];
  segment: Segment | null;
  min: number | null;
  max: number | null;
  sort: SortKey;
  page: number;
}

export const emptyQuery: CatalogQuery = {
  q: "",
  brands: [],
  volumes: [],
  concentrations: [],
  segment: null,
  min: null,
  max: null,
  sort: "brand",
  page: 1,
};

function list(value: string | null): string[] {
  return value
    ? value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
}

function int(value: string | null): number | null {
  if (value === null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : null;
}

export function parseQuery(params: URLSearchParams): CatalogQuery {
  const seg = params.get("seg");
  const sort = params.get("sort");
  const page = int(params.get("page"));
  return {
    q: (params.get("q") ?? "").trim(),
    brands: list(params.get("brand")),
    volumes: list(params.get("vol"))
      .map(Number)
      .filter((n) => Number.isFinite(n) && n > 0),
    concentrations: list(params.get("conc")).filter((c): c is Concentration =>
      (CONCENTRATIONS as readonly string[]).includes(c),
    ),
    segment: (SEGMENTS as readonly string[]).includes(seg ?? "") ? (seg as Segment) : null,
    min: int(params.get("min")),
    max: int(params.get("max")),
    sort: (SORT_KEYS as readonly string[]).includes(sort ?? "") ? (sort as SortKey) : "brand",
    page: page && page > 1 ? page : 1,
  };
}

/** Builds search params, omitting defaults so URLs stay short. */
export function serializeQuery(q: CatalogQuery): URLSearchParams {
  const p = new URLSearchParams();
  if (q.q) p.set("q", q.q);
  if (q.brands.length) p.set("brand", q.brands.join(","));
  if (q.volumes.length) p.set("vol", q.volumes.join(","));
  if (q.concentrations.length) p.set("conc", q.concentrations.join(","));
  if (q.segment) p.set("seg", q.segment);
  if (q.min !== null) p.set("min", String(q.min));
  if (q.max !== null) p.set("max", String(q.max));
  if (q.sort !== "brand") p.set("sort", q.sort);
  if (q.page > 1) p.set("page", String(q.page));
  return p;
}

export function countActiveFilters(q: CatalogQuery): number {
  return (
    (q.q ? 1 : 0) +
    q.brands.length +
    q.volumes.length +
    q.concentrations.length +
    (q.segment ? 1 : 0) +
    (q.min !== null ? 1 : 0) +
    (q.max !== null ? 1 : 0)
  );
}

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[''`]/g, "");
}

/** Precomputed search text per product; built once per module load. */
const searchIndex = new WeakMap<Product, string>();
function searchText(p: Product): string {
  let s = searchIndex.get(p);
  if (!s) {
    s = normalize(p.brand + " " + p.name + " " + p.concentration + " " + p.volumeMl);
    searchIndex.set(p, s);
  }
  return s;
}

export function applyQuery(products: readonly Product[], q: CatalogQuery): Product[] {
  const words = q.q ? normalize(q.q).split(/\s+/).filter(Boolean) : [];
  const brandSet = q.brands.length ? new Set(q.brands) : null;
  const volSet = q.volumes.length ? new Set(q.volumes) : null;
  const concSet = q.concentrations.length ? new Set<string>(q.concentrations) : null;

  const out: Product[] = [];
  for (const p of products) {
    if (brandSet && !brandSet.has(p.brandSlug)) continue;
    if (volSet && !volSet.has(p.volumeMl)) continue;
    if (concSet && !concSet.has(p.concentration)) continue;
    if (q.segment && p.segment !== q.segment) continue;
    if (q.min !== null && p.priceAzn < q.min) continue;
    if (q.max !== null && p.priceAzn > q.max) continue;
    if (words.length) {
      const text = searchText(p);
      let ok = true;
      for (const w of words) {
        if (!text.includes(w)) {
          ok = false;
          break;
        }
      }
      if (!ok) continue;
    }
    out.push(p);
  }

  switch (q.sort) {
    case "price-asc":
      out.sort((a, b) => a.priceAzn - b.priceAzn || a.name.localeCompare(b.name, "en"));
      break;
    case "price-desc":
      out.sort((a, b) => b.priceAzn - a.priceAzn || a.name.localeCompare(b.name, "en"));
      break;
    case "name-asc":
      out.sort((a, b) => a.name.localeCompare(b.name, "en") || a.volumeMl - b.volumeMl);
      break;
    default:
      out.sort(
        (a, b) => a.brand.localeCompare(b.brand, "en") || a.name.localeCompare(b.name, "en") || a.volumeMl - b.volumeMl,
      );
  }
  return out;
}
