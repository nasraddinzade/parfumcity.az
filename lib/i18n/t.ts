import catalogStats from "@/data/catalog-stats.json";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Vars = Record<string, string | number>;

export type Translator = (key: string, vars?: Vars) => string;

/**
 * Catalogue figures available to every message as {brands}, {products}, {min}
 * and {max}. They come from a tiny generated file (checked against the
 * catalogue by scripts/validate-data.ts) so texts never go stale and the full
 * product list is not pulled into client bundles.
 */
const DEFAULT_VARS: Vars = {
  brands: catalogStats.brands,
  products: catalogStats.products,
  min: catalogStats.min,
  max: catalogStats.max,
};

const CATEGORY_ORDER: readonly Intl.LDMLPluralRule[] = ["zero", "one", "two", "few", "many", "other"];
const rulesCache = new Map<string, { rules: Intl.PluralRules; order: Intl.LDMLPluralRule[] }>();

function pluralRules(locale: string) {
  let entry = rulesCache.get(locale);
  if (!entry) {
    const rules = new Intl.PluralRules(locale);
    const used = new Set(rules.resolvedOptions().pluralCategories);
    entry = { rules, order: CATEGORY_ORDER.filter((c) => used.has(c)) };
    rulesCache.set(locale, entry);
  }
  return entry;
}

/**
 * Picks the word form for `n`. Forms are listed in CLDR order for the locale,
 * e.g. Russian "позиция|позиции|позиций" (one|few|many), English "item|items" (one|other).
 */
function pluralForm(n: number, forms: string[], locale: string): string {
  const { rules, order } = pluralRules(locale);
  const index = order.indexOf(rules.select(n));
  return forms[Math.min(index < 0 ? forms.length - 1 : index, forms.length - 1)] ?? "";
}

/**
 * Fills placeholders: {name} inserts the value, {name#form|form|…} inserts the
 * number followed by the plural form that agrees with it.
 */
export function interpolate(value: string, vars: Vars | undefined, locale: string): string {
  const all = vars ? { ...DEFAULT_VARS, ...vars } : DEFAULT_VARS;
  return value.replace(/\{(\w+)(?:#([^}]+))?\}/g, (match, name: string, forms?: string) => {
    if (!(name in all)) return match;
    const v = all[name];
    if (!forms) return String(v);
    const n = typeof v === "number" ? v : Number(v);
    return String(v) + " " + pluralForm(n, forms.split("|"), locale);
  });
}

function lookup(dict: Dictionary, key: string): unknown {
  return key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, dict);
}

export function createTranslator(dict: Dictionary): Translator {
  return (key, vars) => {
    const value = lookup(dict, key);
    if (typeof value !== "string") {
      if (process.env.NODE_ENV !== "production") console.warn("[i18n] missing key: " + key);
      return key;
    }
    return interpolate(value, vars, dict.locale);
  };
}
