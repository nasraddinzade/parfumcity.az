import type { Translator } from "@/lib/i18n/t";
import type { Concentration } from "@/types/product";

/** Short concentration label for cards and cart lines: codes stay as is, "Digər" is translated. */
export function concentrationShort(c: Concentration, t: Translator): string {
  return c === "Digər" ? t("common.concentration.Digər") : c;
}
