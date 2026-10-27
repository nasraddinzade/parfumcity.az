import Image from "next/image";
import Link from "next/link";
import { catalogStats } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import type { Locale } from "@/lib/i18n/config";
import type { Translator } from "@/lib/i18n/t";

export function Hero({ locale, t }: { locale: Locale; t: Translator }) {
  const stats = [
    { value: String(catalogStats.brands), label: t("home.statBrands") },
    { value: String(catalogStats.products), label: t("home.statProducts") },
    {
      value: formatPrice(catalogStats.min, locale) + " – " + formatPrice(catalogStats.max, locale),
      label: t("home.statPrices"),
    },
  ];

  return (
    <section className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_80%_40%,rgba(184,151,90,0.14),transparent_70%)]"
      />
      <div className="container-x relative grid items-center gap-14 py-16 md:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:py-28">
        <div className="flex flex-col gap-8 animate-fade-up">
          <p className="eyebrow">{t("home.heroEyebrow")}</p>
          <h1 className="font-display text-balance text-5xl leading-[1] sm:text-6xl lg:text-7xl">
            {t("home.heroTitle")}
          </h1>
          <p className="max-w-lg text-pretty text-lg text-cream-2">{t("home.heroText")}</p>
          <div className="flex flex-wrap gap-4">
            <Link href={"/" + locale + "/kolleksiya"} className="btn btn-primary">
              {t("home.heroCta")}
            </Link>
            <Link href={"/" + locale + "/brendler"} className="btn btn-outline">
              {t("home.heroCtaSecondary")}
            </Link>
          </div>
          <dl className="mt-4 grid max-w-xl grid-cols-3 gap-6 border-t border-line pt-8">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col gap-1">
                <dt className="caption order-2 text-cream-3">{s.label}</dt>
                <dd className="font-display order-1 text-2xl sm:text-3xl">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <figure className="relative mx-auto w-full max-w-sm animate-fade-in [animation-delay:200ms] lg:max-w-md">
          {/* Thin brass frame offset behind the photo, in the spirit of the hairline layout. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-3 -right-3 left-3 top-3 border border-brass/40"
          />
          <div className="relative aspect-[4/5] overflow-hidden border border-line bg-ink-2">
            <Image
              src="/images/hero/amber-bottle.webp"
              alt={t("home.heroImageAlt")}
              width={1200}
              height={1500}
              priority
              sizes="(min-width: 1024px) 448px, (min-width: 640px) 384px, calc(100vw - 2rem)"
              className="h-full w-full object-cover"
            />
          </div>
        </figure>
      </div>
    </section>
  );
}
