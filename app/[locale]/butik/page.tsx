import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { createTranslator } from "@/lib/i18n/t";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    path: "/butik",
    title: dict.meta.boutique.title,
    description: dict.meta.boutique.description,
  });
}

export default async function BoutiquePage({ params }: { params: Params }) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const t = createTranslator(getDictionary(locale));

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: t("boutique.address"), value: site.address },
    { label: t("boutique.hours"), value: t("boutique.hoursValue") },
    {
      label: t("boutique.phone"),
      value: (
        <a href={site.phoneHref} className="link-line hover:text-brass-2">
          {site.phone}
        </a>
      ),
    },
    {
      label: t("boutique.instagram"),
      value: (
        <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="link-line hover:text-brass-2">
          {site.instagramHandle}
        </a>
      ),
    },
    {
      label: t("boutique.wolt"),
      value: (
        <>
          <span className="block">{t("boutique.woltValue")}</span>
          <a
            href={site.wolt}
            target="_blank"
            rel="noopener noreferrer"
            className="link-line text-sm text-cream-2 hover:text-cream"
          >
            wolt.com
          </a>
        </>
      ),
    },
  ];

  return (
    <div className="container-x py-12 md:py-16">
      <div className="grid gap-12 md:grid-cols-[1fr_1fr] md:gap-20">
        <div className="flex flex-col gap-8">
          <SectionHeading
            as="h1"
            eyebrow={t("boutique.eyebrow")}
            title={t("boutique.title")}
            text={t("boutique.intro")}
          />
          <div className="flex flex-col gap-5 text-pretty text-lg leading-relaxed text-cream-2">
            <p>{t("boutique.text1")}</p>
            <p>{t("boutique.text2")}</p>
          </div>
          <a href={site.mapUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline self-start">
            {t("boutique.map")}
          </a>
        </div>

        <dl className="divide-y divide-line border-y border-line md:mt-4">
          {rows.map((r) => (
            <div key={r.label} className="grid gap-2 py-5 sm:grid-cols-[140px_1fr] sm:gap-6">
              <dt className="caption pt-1 text-cream-3">{r.label}</dt>
              <dd className="text-lg">{r.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <section className="mt-20 border-t border-line pt-10">
        <p className="eyebrow">{t("boutique.conceptEyebrow")}</p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-cream-3">{t("boutique.conceptText")}</p>
      </section>
    </div>
  );
}
