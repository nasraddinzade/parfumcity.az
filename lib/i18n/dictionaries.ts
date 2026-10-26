import az from "@/messages/az.json";
import ru from "@/messages/ru.json";
import en from "@/messages/en.json";
import type { Locale } from "@/lib/i18n/config";

export type Dictionary = typeof az;

// ru and en must have exactly the same shape as az; TypeScript enforces it here.
const dictionaries: Record<Locale, Dictionary> = { az, ru: ru satisfies Dictionary, en: en satisfies Dictionary };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
