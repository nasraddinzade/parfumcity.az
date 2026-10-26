import { ImageResponse } from "next/og";
import { OgFrame } from "@/components/og/og-frame";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { ogFonts, ogSize } from "@/lib/og";

export const alt = "Parfum City";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "az");
  const title = dict.meta.tagline;
  const eyebrow = dict.common.since.replace("{year}", "2023");
  const footer = dict.home.statBrands + " 33 · " + dict.home.statProducts + " 590";
  const fonts = await ogFonts("Parfum City Bakı · Nizami 111 33 590 0123456789" + title + eyebrow + footer);

  return new ImageResponse(
    <OgFrame eyebrow={eyebrow} title={title} footer={footer} hasFonts={fonts.length > 0} />,
    { ...size, fonts },
  );
}
