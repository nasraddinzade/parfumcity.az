import { ImageResponse } from "next/og";
import { OgBottle } from "@/components/og/og-bottle";
import { OgFrame } from "@/components/og/og-frame";
import {
  brands,
  getBrand,
  getBrandProducts,
  getPriceRange,
} from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { ogFonts, ogSize } from "@/lib/og";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    brands.map((b) => ({ locale, brandSlug: b.slug })),
  );
}

export const alt = "Parfum City";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; brandSlug: string }>;
}) {
  const { locale: raw, brandSlug } = await params;
  const locale = isLocale(raw) ? raw : "az";
  const dict = getDictionary(locale);
  const brand = getBrand(brandSlug);
  const title = brand ? brand.name : dict.meta.tagline;
  const eyebrow = brand ? dict.common[brand.segment] : "Parfum City";
  const subtitle = brand
    ? dict.common.productsCount.replace("{count}", String(brand.count)) +
      " · " +
      dict.common.priceFrom.replace(
        "{price}",
        formatPrice(
          getPriceRange(getBrandProducts(brand.slug)).min,
          locale,
        ).replace("₼", "AZN"),
      )
    : undefined;
  const footer = dict.meta.tagline;
  const fonts = await ogFonts();

  return new ImageResponse(
    <OgFrame
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      footer={footer}
    >
      {brand && <OgBottle brand={brand.name} initial={brand.name.charAt(0)} />}
    </OgFrame>,
    { ...size, fonts },
  );
}
