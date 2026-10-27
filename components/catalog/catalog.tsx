"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Filters } from "@/components/catalog/filters";
import { useI18n } from "@/components/providers/i18n-provider";
import { ProductGrid } from "@/components/product/product-grid";
import { CloseIcon, FilterIcon, SearchIcon } from "@/components/ui/icons";
import { brands, products } from "@/lib/catalog";
import {
  applyQuery,
  countActiveFilters,
  emptyQuery,
  PAGE_SIZE,
  parseQuery,
  serializeQuery,
  SORT_KEYS,
  type CatalogQuery,
  type SortKey,
} from "@/lib/catalog-filters";
import { cn } from "@/lib/cn";

const brandName = new Map(brands.map((b) => [b.slug, b.name]));

export function Catalog() {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = useMemo(() => parseQuery(new URLSearchParams(searchParams.toString())), [searchParams]);
  const results = useMemo(() => applyQuery(products, query), [query]);
  const shownCount = Math.min(results.length, query.page * PAGE_SIZE);
  const shown = useMemo(() => results.slice(0, shownCount), [results, shownCount]);
  const activeCount = countActiveFilters(query);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState(query.q);
  const [copied, setCopied] = useState(false);
  const searchTimer = useRef<number | null>(null);

  const navigate = useCallback(
    (next: CatalogQuery) => {
      const qs = serializeQuery(next).toString();
      router.replace(pathname + (qs ? "?" + qs : ""), { scroll: false });
    },
    [router, pathname],
  );

  const update = useCallback(
    (patch: Partial<CatalogQuery>) => navigate({ ...query, ...patch, page: 1 }),
    [navigate, query],
  );

  // Keep the search box in sync when the URL changes from outside (back button, language switch).
  useEffect(() => {
    setSearch(query.q);
  }, [query.q]);

  function onSearchChange(value: string) {
    setSearch(value);
    if (searchTimer.current) window.clearTimeout(searchTimer.current);
    searchTimer.current = window.setTimeout(() => update({ q: value.trim() }), 300);
  }

  useEffect(() => {
    if (!filtersOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFiltersOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [filtersOpen]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard may be unavailable; the URL bar still has the link.
    }
  }

  const sortLabels: Record<SortKey, string> = {
    brand: t("catalog.sortDefault"),
    "price-asc": t("catalog.sortPriceAsc"),
    "price-desc": t("catalog.sortPriceDesc"),
    "name-asc": t("catalog.sortNameAsc"),
  };

  const chips: { key: string; label: string; remove: () => void }[] = [];
  if (query.q) chips.push({ key: "q", label: "“" + query.q + "”", remove: () => update({ q: "" }) });
  if (query.segment)
    chips.push({ key: "seg", label: t("common." + query.segment), remove: () => update({ segment: null }) });
  for (const b of query.brands)
    chips.push({
      key: "b" + b,
      label: brandName.get(b) ?? b,
      remove: () => update({ brands: query.brands.filter((x) => x !== b) }),
    });
  for (const v of query.volumes)
    chips.push({
      key: "v" + v,
      label: v + " " + t("common.ml"),
      remove: () => update({ volumes: query.volumes.filter((x) => x !== v) }),
    });
  for (const c of query.concentrations)
    chips.push({
      key: "c" + c,
      label: c === "Digər" ? t("common.concentration.Digər") : c,
      remove: () => update({ concentrations: query.concentrations.filter((x) => x !== c) }),
    });
  if (query.min !== null)
    chips.push({ key: "min", label: "≥ " + query.min + " ₼", remove: () => update({ min: null }) });
  if (query.max !== null)
    chips.push({ key: "max", label: "≤ " + query.max + " ₼", remove: () => update({ max: null }) });

  const filterProps = { query, onChange: update, onClear: () => navigate(emptyQuery), activeCount };

  return (
    <div className="grid gap-10 lg:grid-cols-[250px_1fr] lg:gap-14">
      <aside className="scrollbar-thin hidden lg:sticky lg:top-28 lg:block lg:max-h-[calc(100dvh-8rem)] lg:self-start lg:overflow-y-auto lg:pr-3">
        <Filters {...filterProps} idPrefix="desk" />
      </aside>

      <div className="min-w-0">
        <div className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
          <label className="relative flex flex-1 items-center">
            <span className="sr-only">{t("catalog.search")}</span>
            <SearchIcon size={16} className="pointer-events-none absolute left-0 text-cream-3" />
            <input
              type="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t("catalog.searchPlaceholder")}
              className="field pl-7"
              autoComplete="off"
            />
          </label>
          <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 sm:gap-6">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="caption flex items-center gap-2 py-2 text-cream-2 hover:text-cream lg:hidden"
              aria-expanded={filtersOpen}
              aria-controls="mobile-filters"
            >
              <FilterIcon size={16} />
              {t("catalog.filters")}
              {activeCount > 0 && <span className="text-brass">({activeCount})</span>}
            </button>
            <label className="caption flex min-w-0 max-w-full items-center gap-2 text-cream-3">
              <span className="sr-only sm:not-sr-only">{t("catalog.sort")}</span>
              <select
                value={query.sort}
                onChange={(e) => update({ sort: e.target.value as SortKey })}
                className="caption min-w-0 max-w-full cursor-pointer border-b border-line-strong bg-transparent py-2 pr-1 text-cream focus:border-cream focus:outline-none"
              >
                {SORT_KEYS.map((k) => (
                  <option key={k} value={k} className="bg-ink text-cream">
                    {sortLabels[k]}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-4">
          <p className="text-sm text-cream-2" aria-live="polite" data-testid="results-count">
            {t("catalog.results", { count: results.length })}
          </p>
          <button type="button" onClick={copyLink} className="link-line text-xs text-cream-3 hover:text-cream">
            {copied ? t("catalog.copied") : t("catalog.copyLink")}
          </button>
        </div>

        {chips.length > 0 && (
          <ul className="mb-6 flex flex-wrap gap-2">
            {chips.map((c) => (
              <li key={c.key}>
                <button
                  type="button"
                  onClick={c.remove}
                  className="flex min-h-8 items-center gap-2 border border-line px-3 text-xs text-cream-2 transition-colors hover:border-cream hover:text-cream"
                >
                  {c.label}
                  <CloseIcon size={12} />
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => navigate(emptyQuery)}
                className="link-line min-h-8 text-xs text-cream-3 hover:text-cream"
              >
                {t("catalog.clearFilters")}
              </button>
            </li>
          </ul>
        )}

        {results.length === 0 ? (
          <div className="flex flex-col items-start gap-3 border-t border-line py-16">
            <p className="font-display text-2xl">{t("catalog.empty")}</p>
            <p className="text-cream-2">{t("catalog.emptyHint")}</p>
            <button type="button" onClick={() => navigate(emptyQuery)} className="btn btn-outline mt-3">
              {t("catalog.clearFilters")}
            </button>
          </div>
        ) : (
          <>
            <ProductGrid products={shown} columns={3} priorityCount={4} headingLevel="h2" />
            <div className="mt-14 flex flex-col items-center gap-4">
              <p className="text-xs text-cream-3">
                {t("catalog.showing", { shown: shownCount, total: results.length })}
              </p>
              {shownCount < results.length && (
                <button
                  type="button"
                  onClick={() => navigate({ ...query, page: query.page + 1 })}
                  className="btn btn-outline"
                >
                  {t("catalog.showMore", { count: Math.min(PAGE_SIZE, results.length - shownCount) })}
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <div
        aria-hidden="true"
        onClick={() => setFiltersOpen(false)}
        className={cn(
          "fixed inset-0 z-50 bg-ink/70 transition-opacity duration-500 ease-soft lg:hidden",
          filtersOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <div
        id="mobile-filters"
        role="dialog"
        aria-modal="true"
        aria-label={t("catalog.filters")}
        inert={!filtersOpen}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-full max-w-sm flex-col border-r border-line bg-ink-2 transition-transform duration-500 ease-soft lg:hidden",
          filtersOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-5">
          <p className="font-display text-2xl">{t("catalog.filters")}</p>
          <button
            type="button"
            onClick={() => setFiltersOpen(false)}
            aria-label={t("catalog.closeFilters")}
            className="-mr-2 flex h-11 w-11 items-center justify-center text-cream-2 hover:text-cream"
          >
            <CloseIcon size={20} />
          </button>
        </div>
        <div className="scrollbar-thin flex-1 overflow-y-auto px-5 py-6">
          <Filters {...filterProps} idPrefix="mob" />
        </div>
        <div className="border-t border-line px-5 py-4">
          <button type="button" onClick={() => setFiltersOpen(false)} className="btn btn-primary w-full">
            {t("catalog.results", { count: results.length })}
          </button>
        </div>
      </div>
    </div>
  );
}
