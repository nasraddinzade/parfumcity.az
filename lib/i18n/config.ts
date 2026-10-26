export const locales = ["az", "ru", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "az";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export function isLocale(value: string | undefined | null): value is Locale {
  return locales.includes(value as Locale);
}

export const localeNames: Record<Locale, string> = { az: "Azərbaycan", ru: "Русский", en: "English" };
export const htmlLang: Record<Locale, string> = { az: "az-AZ", ru: "ru-RU", en: "en" };
export const ogLocale: Record<Locale, string> = { az: "az_AZ", ru: "ru_RU", en: "en_GB" };
