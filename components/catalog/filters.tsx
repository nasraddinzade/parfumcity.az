"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/providers/i18n-provider";
import { allConcentrations, allVolumes, brandsSorted, catalogStats } from "@/lib/catalog";
import type { CatalogQuery } from "@/lib/catalog-filters";
import { cn } from "@/lib/cn";
import type { Concentration, Segment } from "@/types/product";

export interface FiltersProps {
  query: CatalogQuery;
  onChange: (patch: Partial<CatalogQuery>) => void;
  onClear: () => void;
  activeCount: number;
  idPrefix?: string;
}

function toggle<T>(list: readonly T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line py-6 first:border-t-0 first:pt-0">
      <p className="caption mb-4 text-cream-3">{title}</p>
      {children}
    </div>
  );
}

function Chip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "min-h-9 border px-3 text-xs tracking-wide transition-colors duration-300",
        active ? "border-cream bg-cream text-ink" : "border-line-strong text-cream-2 hover:border-cream hover:text-cream",
      )}
    >
      {children}
    </button>
  );
}

export function Filters({ query, onChange, onClear, activeCount, idPrefix = "f" }: FiltersProps) {
  const { t } = useI18n();
  const [min, setMin] = useState(query.min === null ? "" : String(query.min));
  const [max, setMax] = useState(query.max === null ? "" : String(query.max));

  useEffect(() => {
    setMin(query.min === null ? "" : String(query.min));
    setMax(query.max === null ? "" : String(query.max));
  }, [query.min, query.max]);

  function commitPrice() {
    const toNum = (v: string) => (v.trim() === "" ? null : Math.max(0, Math.floor(Number(v))));
    const nextMin = toNum(min);
    const nextMax = toNum(max);
    onChange({
      min: nextMin !== null && Number.isFinite(nextMin) ? nextMin : null,
      max: nextMax !== null && Number.isFinite(nextMax) ? nextMax : null,
    });
  }

  const segments: { value: Segment | null; label: string }[] = [
    { value: null, label: t("common.all") },
    { value: "niche", label: t("common.niche") },
    { value: "designer", label: t("common.designer") },
  ];

  return (
    <div className="flex flex-col">
      <Group title={t("catalog.segment")}>
        <div className="flex flex-wrap gap-2">
          {segments.map((s) => (
            <Chip key={String(s.value)} active={query.segment === s.value} onClick={() => onChange({ segment: s.value })}>
              {s.label}
            </Chip>
          ))}
        </div>
      </Group>

      <Group title={t("catalog.brand")}>
        <ul className="scrollbar-thin -mr-2 flex max-h-72 flex-col gap-1 overflow-y-auto pr-2">
          {brandsSorted.map((b) => {
            const id = idPrefix + "-brand-" + b.slug;
            const checked = query.brands.includes(b.slug);
            return (
              <li key={b.slug}>
                <label
                  htmlFor={id}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-3 py-1.5 text-sm transition-colors",
                    checked ? "text-cream" : "text-cream-2 hover:text-cream",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <input
                      id={id}
                      type="checkbox"
                      aria-label={b.name}
                      checked={checked}
                      onChange={() => onChange({ brands: toggle(query.brands, b.slug) })}
                      className="h-4 w-4 shrink-0 appearance-none border border-line-strong checked:border-cream checked:bg-cream"
                    />
                    {b.name}
                  </span>
                  <span className="text-xs tabular-nums text-cream-3">{b.count}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </Group>

      <Group title={t("catalog.volume")}>
        <div className="flex flex-wrap gap-2">
          {allVolumes.map((v) => (
            <Chip key={v} active={query.volumes.includes(v)} onClick={() => onChange({ volumes: toggle(query.volumes, v) })}>
              {v} {t("common.ml")}
            </Chip>
          ))}
        </div>
      </Group>

      <Group title={t("catalog.concentration")}>
        <div className="flex flex-wrap gap-2">
          {allConcentrations.map((c: Concentration) => (
            <Chip
              key={c}
              active={query.concentrations.includes(c)}
              onClick={() => onChange({ concentrations: toggle(query.concentrations, c) })}
            >
              {c === "Digər" ? t("common.concentration.Digər") : c}
            </Chip>
          ))}
        </div>
      </Group>

      <Group title={t("catalog.price")}>
        <form
          className="flex items-end gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            commitPrice();
          }}
        >
          <label className="flex flex-1 flex-col gap-1 text-xs text-cream-3">
            {t("catalog.priceMin")}
            <input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder={String(catalogStats.min)}
              value={min}
              onChange={(e) => setMin(e.target.value)}
              onBlur={commitPrice}
              className="field py-2 text-sm"
            />
          </label>
          <span className="pb-3 text-cream-3">–</span>
          <label className="flex flex-1 flex-col gap-1 text-xs text-cream-3">
            {t("catalog.priceMax")}
            <input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder={String(catalogStats.max)}
              value={max}
              onChange={(e) => setMax(e.target.value)}
              onBlur={commitPrice}
              className="field py-2 text-sm"
            />
          </label>
          <button type="submit" className="sr-only">
            {t("catalog.price")}
          </button>
        </form>
      </Group>

      {activeCount > 0 && (
        <div className="border-t border-line pt-6">
          <button type="button" onClick={onClear} className="link-line text-sm text-cream-2 hover:text-cream">
            {t("catalog.clearFilters")} ({activeCount})
          </button>
        </div>
      )}
    </div>
  );
}
