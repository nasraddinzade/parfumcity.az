import { ImageResponse } from "next/og";
import { OgBottle } from "@/components/og/og-bottle";
import { OgFrame } from "@/components/og/og-frame";
import { getProduct } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { ogFonts, ogSize } from "@/lib/og";

export const alt = "Parfum City";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale = isLocale(raw) ? raw : "az";
  const dict = getDictionary(locale);
  const product = getProduct(slug);
  const title = product ? product.name : dict.meta.tagline;
  const eyebrow = product ? product.brand : "Parfum City";
  const subtitle = product ? product.volumeMl + " ml · " + product.concentration + " · " + formatPrice(product.priceAzn, locale) : undefined;
  const footer = dict.meta.tagline;
  const fonts = await ogFonts("Parfum City Bakı · Nizami 111 ₼ 0123456789 ml" + title + eyebrow + (subtitle ?? "") + footer);

  return new ImageResponse(
    <OgFrame eyebrow={eyebrow} title={title} subtitle={subtitle} footer={footer} hasFonts={fonts.length > 0}>
      {product && <OgBottle brand={product.brand} initial={product.brand.charAt(0)} />}
    </OgFrame>,
    { ...size, fonts },
  );
}
