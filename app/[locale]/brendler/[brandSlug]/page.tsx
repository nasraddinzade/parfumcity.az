import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product/product-grid";
import { ArrowIcon } from "@/components/ui/icons";
import { getBrandDescription } from "@/data/brand-descriptions";
import { brands, getBrand, getBrandProducts, getPriceRange } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { createTranslator } from "@/lib/i18n/t";
import { pageMetadata } from "@/lib/seo";

type Params = Promise<{ locale: string; brandSlug: string }>;

export function generateStaticParams() {
  return locales.flatMap((locale) => brands.map((b) => ({ locale, brandSlug: b.slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, brandSlug } = await params;
  if (!isLocale(locale)) return {};
  const brand = getBrand(brandSlug);
  if (!brand) return {};
  const t = createTranslator(getDictionary(locale));
  const { min } = getPriceRange(getBrandProducts(brand.slug));
  return pageMetadata({
    locale,
    path: "/brendler/" + brand.slug,
    title: t("meta.brand.title", { brand: brand.name }),
    description: t("meta.brand.description", { brand: brand.name, count: brand.count, priceFrom: formatPrice(min, locale) }),
  });
}

export default async function BrandPage({ params }: { params: Params }) {
  const { locale, brandSlug } = await params;
  if (!isLocale(locale)) notFound();
  const brand = getBrand(brandSlug);
  if (!brand) notFound();
  const t = createTranslator(getDictionary(locale));

  const list = [...getBrandProducts(brand.slug)].sort((a, b) => a.name.localeCompare(b.name, "en") || a.volumeMl - b.volumeMl);
  const { min, max } = getPriceRange(list);
  const concentrations = [...new Set(list.map((p) => p.concentration))];
  const description = getBrandDescription(brand.slug, locale) ?? t("brand.genericDescription", { brand: brand.name, count: brand.count });

  return (
    <div className="container-x py-12 md:py-16">
      <nav aria-label="Breadcrumb" className="caption flex flex-wrap items-center gap-3 text-cream-3">
        <Link href={"/" + locale + "/brendler"} className="link-line hover:text-cream">
          {t("brand.allBrands")}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-cream-2">{brand.name}</span>
      </nav>

      <header className="mt-10 grid gap-10 border-b border-line pb-12 md:grid-cols-[1.2fr_0.8fr] md:gap-16">
        <div className="flex flex-col gap-6">
          <p className="eyebrow">{t("common." + brand.segment)}</p>
          <h1 className="font-display text-5xl sm:text-6xl">{brand.name}</h1>
          <p className="max-w-xl text-pretty text-lg leading-relaxed text-cream-2">{description}</p>
        </div>
        <dl className="grid grid-cols-2 gap-6 self-end sm:grid-cols-3 md:grid-cols-1 md:border-l md:border-line md:pl-10">
          <div>
            <dt className="caption mb-1 text-cream-3">{t("brand.products")}</dt>
            <dd className="font-display text-3xl">{brand.count}</dd>
          </div>
          <div>
            <dt className="caption mb-1 text-cream-3">{t("brand.priceFrom")}</dt>
            <dd className="font-display text-3xl">
              {formatPrice(min, locale)}
              {max !== min && <span className="text-base text-cream-3"> – {formatPrice(max, locale)}</span>}
            </dd>
          </div>
          <div>
            <dt className="caption mb-1 text-cream-3">{t("brand.concentrations")}</dt>
            <dd className="text-sm text-cream-2">{concentrations.map((c) => (c === "Digər" ? t("common.concentration.Digər") : c)).join(" · ")}</dd>
          </div>
        </dl>
      </header>

      <ProductGrid products={list} className="mt-12" priorityCount={4} />

      <div className="mt-16 flex justify-center">
        <Link href={"/" + locale + "/brendler"} className="caption link-line flex items-center gap-2 text-cream-2 hover:text-cream">
          <ArrowIcon size={14} className="rotate-180" />
          {t("brand.allBrands")}
        </Link>
      </div>
    </div>
  );
}
