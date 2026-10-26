import type { Metadata } from "next";
import { locales, ogLocale, type Locale } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/site";

/** Absolute URL for a locale-prefixed path such as "/kolleksiya". */
export function localeUrl(locale: Locale, path = ""): string {
  return SITE_URL + "/" + locale + path;
}

export function languageAlternates(path = ""): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = localeUrl(l, path);
  languages["x-default"] = localeUrl("az", path);
  return languages;
}

interface PageMeta {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  /** Absolute title: skip the "| Parfum City" template. */
  absolute?: boolean;
  type?: "website" | "article";
  noIndex?: boolean;
}

export function pageMetadata({ locale, path = "", title, description, absolute, noIndex }: PageMeta): Metadata {
  const url = localeUrl(locale, path);
  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      title,
      description,
      url,
      siteName: "Parfum City",
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}
