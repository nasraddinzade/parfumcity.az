import type { Locale } from "@/lib/i18n/config";

const intlLocale: Record<Locale, string> = { az: "az-AZ", ru: "ru-RU", en: "en-GB" };

const formatters = new Map<string, Intl.NumberFormat>();

function formatter(locale: Locale, fraction: boolean): Intl.NumberFormat {
  const key = locale + ":" + fraction;
  let f = formatters.get(key);
  if (!f) {
    f = new Intl.NumberFormat(intlLocale[locale], {
      minimumFractionDigits: fraction ? 2 : 0,
      maximumFractionDigits: fraction ? 2 : 0,
    });
    formatters.set(key, f);
  }
  return f;
}

/** Formats an AZN amount with the manat sign, e.g. "1 234 ₼" or "0,49 ₼". */
export function formatPrice(amount: number, locale: Locale): string {
  const fraction = !Number.isInteger(amount);
  return formatter(locale, fraction).format(amount) + " ₼";
}

export function formatVolume(ml: number): string {
  return ml + " ml";
}
