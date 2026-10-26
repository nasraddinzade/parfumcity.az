import { ImageResponse } from "next/og";
import { OgFrame } from "@/components/og/og-frame";
import { isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { ogFonts, ogSize } from "@/lib/og";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const alt = "Parfum City";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "az");
  const title = dict.meta.tagline;
  const eyebrow = dict.common.since.replace("{year}", "2023");
  const footer = dict.home.statBrands + " 33 · " + dict.home.statProducts + " 590";
  const fonts = await ogFonts();

  return new ImageResponse(<OgFrame eyebrow={eyebrow} title={title} footer={footer} />, { ...size, fonts });
}
