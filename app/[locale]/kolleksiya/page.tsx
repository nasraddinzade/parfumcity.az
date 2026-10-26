import type { Metadata } from "next";
import { Suspense } from "react";
import { Catalog } from "@/components/catalog/catalog";
import { SectionHeading } from "@/components/ui/section-heading";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { createTranslator } from "@/lib/i18n/t";
import { pageMetadata } from "@/lib/seo";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return pageMetadata({ locale, path: "/kolleksiya", title: dict.meta.catalog.title, description: dict.meta.catalog.description });
}

export default async function CatalogPage({ params }: { params: Params }) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const t = createTranslator(getDictionary(locale));

  return (
    <div className="container-x py-12 md:py-16">
      <SectionHeading as="h1" eyebrow={t("catalog.eyebrow")} title={t("catalog.title")} text={t("catalog.intro")} />
      <div className="mt-12">
        <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
          <Catalog />
        </Suspense>
      </div>
    </div>
  );
}
