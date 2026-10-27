import type { Metadata } from "next";
import Link from "next/link";
import { BrandMarquee } from "@/components/home/brand-marquee";
import { Hero } from "@/components/home/hero";
import { ProductGrid } from "@/components/product/product-grid";
import { JsonLd } from "@/components/seo/json-ld";
import { ArrowIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { catalogStats, featuredProducts } from "@/lib/catalog";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { createTranslator } from "@/lib/i18n/t";
import { localeUrl, pageMetadata } from "@/lib/seo";
import { site, SITE_URL } from "@/lib/site";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    title: dict.meta.home.title,
    description: createTranslator(dict)("meta.home.description"),
    absolute: true,
  });
}

function storeJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    name: site.name,
    url: localeUrl(locale),
    image: SITE_URL + "/" + locale + "/opengraph-image",
    telephone: site.phone,
    sameAs: [site.instagram, site.wolt],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Nizami küçəsi 111",
      addressLocality: site.geo.city,
      addressRegion: site.geo.district,
      postalCode: site.geo.postalCode,
      addressCountry: site.geo.country,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: site.hours.open,
      closes: site.hours.close,
    },
    priceRange: catalogStats.min + "–" + catalogStats.max + " AZN",
    currenciesAccepted: "AZN",
  };
}

export default async function HomePage({ params }: { params: Params }) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const t = createTranslator(getDictionary(locale));

  const services = [
    { title: t("home.service1Title"), text: t("home.service1Text"), href: "/" + locale + "/butik", external: false },
    { title: t("home.service2Title"), text: t("home.service2Text"), href: site.wolt, external: true },
    { title: t("home.service3Title"), text: t("home.service3Text"), href: site.phoneHref, external: true },
  ];

  return (
    <>
      <JsonLd data={storeJsonLd(locale)} />
      <Hero locale={locale} t={t} />
      <BrandMarquee locale={locale} label={t("home.brandsEyebrow")} />

      <section className="container-x py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={t("home.featuredEyebrow")} title={t("home.featuredTitle")} />
          <Link
            href={"/" + locale + "/kolleksiya"}
            className="caption link-line flex items-center gap-2 pb-2 text-cream-2 hover:text-cream"
          >
            {t("common.viewAll")}
            <ArrowIcon size={14} />
          </Link>
        </div>
        <ProductGrid products={featuredProducts} className="mt-12" />
      </section>

      <section className="border-y border-line bg-ink-2">
        <div className="container-x grid gap-10 py-20 md:grid-cols-[0.9fr_1.1fr] md:gap-16 md:py-28">
          <SectionHeading eyebrow={t("home.editorialEyebrow")} title={t("home.editorialTitle")} />
          <div className="flex flex-col gap-6 text-pretty text-lg leading-relaxed text-cream-2 md:pt-12">
            <p>{t("home.editorialText1")}</p>
            <p>{t("home.editorialText2")}</p>
          </div>
        </div>
      </section>

      <section aria-hidden="true" className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_80%_at_50%_100%,rgba(184,151,90,0.18),transparent_70%)]" />
        <div className="container-x relative flex items-center justify-center py-20 md:py-32">
          <p className="font-display text-center text-[clamp(3rem,12vw,10rem)] leading-none tracking-[0.02em] text-cream/90">
            Nizami 111
          </p>
        </div>
      </section>

      <section className="container-x py-20 md:py-28">
        <SectionHeading eyebrow={t("home.servicesEyebrow")} title={t("home.servicesTitle")} />
        <ul className="hairline-grid mt-12 sm:grid-cols-3">
          {services.map((s, i) => (
            <li key={s.title} className="flex flex-col gap-4 p-6 sm:p-8">
              <p className="font-display text-xl text-brass-2">0{i + 1}</p>
              <h3 className="font-display text-2xl">{s.title}</h3>
              <p className="text-sm leading-relaxed text-cream-2">{s.text}</p>
              <a
                href={s.href}
                target={s.external && s.href.startsWith("http") ? "_blank" : undefined}
                rel={s.external && s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="caption link-line mt-auto w-fit pt-2 text-cream-3 hover:text-cream"
              >
                {s.external && s.href.startsWith("http")
                  ? "Wolt"
                  : s.href.startsWith("tel:")
                    ? site.phone
                    : t("nav.boutique")}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-line">
        <div className="container-x grid gap-10 py-20 md:grid-cols-2 md:gap-16 md:py-28">
          <SectionHeading eyebrow={t("home.visitEyebrow")} title={t("home.visitTitle")} />
          <dl className="grid gap-8 sm:grid-cols-2 md:pt-12">
            <div>
              <dt className="caption mb-2 text-cream-3">{t("home.visitEyebrow")}</dt>
              <dd className="text-lg">
                {site.address}
                <a
                  href={site.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="caption link-line mt-3 block w-fit text-cream-2 hover:text-cream"
                >
                  {t("home.mapLink")}
                </a>
              </dd>
            </div>
            <div>
              <dt className="caption mb-2 text-cream-3">{t("home.visitHours")}</dt>
              <dd className="text-lg">{t("home.visitHoursValue")}</dd>
            </div>
            <div>
              <dt className="caption mb-2 text-cream-3">{t("boutique.phone")}</dt>
              <dd>
                <a href={site.phoneHref} className="link-line text-lg hover:text-brass-2">
                  {site.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="caption mb-2 text-cream-3">Instagram</dt>
              <dd>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-line text-lg hover:text-brass-2"
                >
                  {site.instagramHandle}
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}
