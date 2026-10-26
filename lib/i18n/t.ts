import type { Dictionary } from "@/lib/i18n/dictionaries";

type Vars = Record<string, string | number>;

export type Translator = (key: string, vars?: Vars) => string;

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
    if (!vars) return value;
    return value.replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match));
  };
}
