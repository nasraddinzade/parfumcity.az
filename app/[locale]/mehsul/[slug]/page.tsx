import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductImage } from "@/components/product/product-image";
import { JsonLd } from "@/components/seo/json-ld";
import { ArrowIcon } from "@/components/ui/icons";
import { resolveProductImage } from "@/data/images";
import { getProduct, getSimilar, getVariants, products } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { createTranslator } from "@/lib/i18n/t";
import { localeUrl, pageMetadata } from "@/lib/seo";
import { site, SITE_URL } from "@/lib/site";
import type { Product } from "@/types/product";

type Params = Promise<{ locale: string; slug: string }>;

export function generateStaticParams() {
  return locales.flatMap((locale) => products.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const product = getProduct(slug);
  if (!product) return {};
  const t = createTranslator(getDictionary(locale));
  return pageMetadata({
    locale,
    path: "/mehsul/" + product.slug,
    title: t("meta.product.title", { name: product.name, brand: product.brand, volume: product.volumeMl }),
    description: t("meta.product.description", {
      name: product.name,
      brand: product.brand,
      volume: product.volumeMl,
      concentration: t("common.concentration." + product.concentration),
      price: formatPrice(product.priceAzn, locale),
    }),
  });
}

function productJsonLd(product: Product, locale: Locale) {
  const resolved = resolveProductImage(product).src;
  const image = resolved
    ? resolved.startsWith("/")
      ? SITE_URL + resolved
      : resolved
    : SITE_URL + "/" + locale + "/mehsul/" + product.slug + "/opengraph-image";
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.id,
    brand: { "@type": "Brand", name: product.brand },
    image,
    url: localeUrl(locale, "/mehsul/" + product.slug),
    size: product.volumeMl + " ml",
    category: product.segment === "niche" ? "Niche perfumery" : "Designer perfumery",
    offers: {
      "@type": "Offer",
      price: product.priceAzn,
      priceCurrency: "AZN",
      availability: "https://schema.org/InStock",
      url: localeUrl(locale, "/mehsul/" + product.slug),
      seller: { "@type": "Store", name: site.name },
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const product = getProduct(slug);
  if (!product) notFound();
  const t = createTranslator(getDictionary(locale));
  const variants = getVariants(product);
  const similar = getSimilar(product, 4);

  return (
    <div className="container-x py-10 md:py-16">
      <JsonLd data={productJsonLd(product, locale)} />

      <nav aria-label="Breadcrumb" className="caption flex flex-wrap items-center gap-3 text-cream-3">
        <Link href={"/" + locale + "/kolleksiya"} className="link-line hover:text-cream">
          {t("product.breadcrumbCatalog")}
        </Link>
        <span aria-hidden="true">/</span>
        <Link href={"/" + locale + "/brendler/" + product.brandSlug} className="link-line hover:text-cream">
          {product.brand}
        </Link>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <ProductImage product={product} sizes="(min-width: 1024px) 560px, 100vw" priority />
        </div>

        <div className="flex flex-col gap-8 lg:py-6">
          <div className="flex flex-col gap-4">
            <Link href={"/" + locale + "/brendler/" + product.brandSlug} className="eyebrow link-line w-fit">
              {product.brand}
            </Link>
            <h1 className="font-display text-balance text-4xl sm:text-5xl">{product.name}</h1>
            <p className="text-cream-2">
              {product.volumeMl} {t("common.ml")} · {t("common.concentration." + product.concentration)}
            </p>
          </div>

          <p className="font-display text-3xl">{formatPrice(product.priceAzn, locale)}</p>

          {variants.length > 1 && (
            <div className="flex flex-col gap-3">
              <p className="caption text-cream-3">{t("product.otherVolumes")}</p>
              <ul className="flex flex-wrap gap-2">
                {variants.map((v) => {
                  const current = v.slug === product.slug;
                  return (
                    <li key={v.slug}>
                      <Link
                        href={"/" + locale + "/mehsul/" + v.slug}
                        aria-current={current ? "page" : undefined}
                        className={cn(
                          "flex min-h-11 flex-col items-center justify-center border px-4 text-xs leading-tight transition-colors duration-300",
                          current
                            ? "border-cream bg-cream text-ink"
                            : "border-line-strong text-cream-2 hover:border-cream hover:text-cream",
                        )}
                      >
                        <span>
                          {v.volumeMl} {t("common.ml")}
                        </span>
                        <span className={current ? "text-ink/70" : "text-cream-3"}>
                          {formatPrice(v.priceAzn, locale)}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <AddToCartButton slug={product.slug} />

          <section aria-labelledby="delivery-title" className="border-t border-line pt-8">
            <h2 id="delivery-title" className="caption font-sans text-cream-3">
              {t("product.deliveryTitle")}
            </h2>
            <dl className="mt-5 flex flex-col gap-5">
              <div>
                <dt className="text-sm">{t("product.deliveryPickup")}</dt>
                <dd className="text-sm text-cream-3">{t("product.deliveryPickupText")}</dd>
              </div>
              <div>
                <dt className="text-sm">{t("product.deliveryWolt")}</dt>
                <dd className="text-sm text-cream-3">
                  {t("product.deliveryWoltText")}{" "}
                  <a
                    href={site.wolt}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-line text-cream-2 hover:text-cream"
                  >
                    Wolt
                  </a>
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-24 border-t border-line pt-16">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-display text-3xl">{t("product.similar", { brand: product.brand })}</h2>
            <Link
              href={"/" + locale + "/brendler/" + product.brandSlug}
              className="caption link-line flex items-center gap-2 pb-1 text-cream-2 hover:text-cream"
            >
              {t("product.allFromBrand", { brand: product.brand })}
              <ArrowIcon size={14} />
            </Link>
          </div>
          <ProductGrid products={similar} className="mt-10" />
        </section>
      )}
    </div>
  );
}
