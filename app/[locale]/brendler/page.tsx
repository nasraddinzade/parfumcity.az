import type { Metadata } from "next";
import { Suspense } from "react";
import { BrandGrid } from "@/components/brands/brand-grid";
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
  return pageMetadata({
    locale,
    path: "/brendler",
    title: dict.meta.brands.title,
    description: createTranslator(dict)("meta.brands.description"),
  });
}

export default async function BrandsPage({ params }: { params: Params }) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const t = createTranslator(getDictionary(locale));

  return (
    <div className="container-x py-12 md:py-16">
      <SectionHeading as="h1" eyebrow={t("brands.eyebrow")} title={t("brands.title")} text={t("brands.intro")} />
      <div className="mt-12">
        <Suspense fallback={<div className="min-h-96" aria-busy="true" />}>
          <BrandGrid />
        </Suspense>
      </div>
    </div>
  );
}
