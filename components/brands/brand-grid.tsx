"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useI18n } from "@/components/providers/i18n-provider";
import { brandsSorted, getBrandProducts, getPriceRange } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import type { Segment } from "@/types/product";

export function BrandGrid() {
  const { locale, t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const seg = params.get("seg");
  const segment: Segment | null = seg === "niche" || seg === "designer" ? seg : null;

  const list = useMemo(() => brandsSorted.filter((b) => !segment || b.segment === segment), [segment]);

  function setSegment(value: Segment | null) {
    router.replace(pathname + (value ? "?seg=" + value : ""), { scroll: false });
  }

  const options: { value: Segment | null; label: string }[] = [
    { value: null, label: t("brands.filterAll") },
    { value: "niche", label: t("brands.filterNiche") },
    { value: "designer", label: t("brands.filterDesigner") },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
        <div className="flex gap-6" role="group" aria-label={t("brands.filterLabel")}>
          {options.map((o) => (
            <button
              key={String(o.value)}
              type="button"
              aria-pressed={segment === o.value}
              onClick={() => setSegment(o.value)}
              className={cn(
                "caption link-line py-2 transition-colors",
                segment === o.value ? "text-cream" : "text-cream-3 hover:text-cream",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-cream-3" aria-live="polite">
          {t("brands.shown", { count: list.length })}
        </p>
      </div>

      <ul className="hairline-grid mt-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {list.map((b) => {
          const { min } = getPriceRange(getBrandProducts(b.slug));
          return (
            <li key={b.slug} className="group">
              <Link
                href={"/" + locale + "/brendler/" + b.slug}
                className="flex h-full min-h-44 flex-col justify-between gap-6 p-5 transition-colors duration-500 hover:bg-panel sm:p-6"
              >
                <p className="caption text-cream-3">{t("common." + b.segment)}</p>
                <div className="flex flex-col gap-2">
                  <p className="font-display text-xl leading-tight text-cream group-hover:text-brass-2 sm:text-2xl">
                    {b.name}
                  </p>
                  <p className="text-xs text-cream-2">
                    {t("common.productsCount", { count: b.count })} ·{" "}
                    {t("common.priceFrom", { price: formatPrice(min, locale) })}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
