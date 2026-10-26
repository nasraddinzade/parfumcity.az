import type { MetadataRoute } from "next";
import { brands, products } from "@/lib/catalog";
import { locales } from "@/lib/i18n/config";
import { languageAlternates, localeUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const paths: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/kolleksiya", priority: 0.9, changeFrequency: "weekly" },
    { path: "/brendler", priority: 0.8, changeFrequency: "monthly" },
    { path: "/butik", priority: 0.6, changeFrequency: "monthly" },
    ...brands.map((b) => ({ path: "/brendler/" + b.slug, priority: 0.7, changeFrequency: "weekly" as const })),
    ...products.map((p) => ({ path: "/mehsul/" + p.slug, priority: 0.6, changeFrequency: "weekly" as const })),
  ];

  const entries: MetadataRoute.Sitemap = [];
  for (const { path, priority, changeFrequency } of paths) {
    const languages = languageAlternates(path);
    for (const locale of locales) {
      entries.push({ url: localeUrl(locale, path), lastModified, changeFrequency, priority, alternates: { languages } });
    }
  }
  return entries;
}
