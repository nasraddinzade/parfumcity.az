import Link from "next/link";
import { BottlePlaceholder } from "@/components/product/bottle-placeholder";
import { catalogStats } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import type { Locale } from "@/lib/i18n/config";
import type { Translator } from "@/lib/i18n/t";

export function Hero({ locale, t }: { locale: Locale; t: Translator }) {
  const stats = [
    { value: String(catalogStats.brands), label: t("home.statBrands") },
    { value: String(catalogStats.products), label: t("home.statProducts") },
    { value: formatPrice(catalogStats.min, locale) + " – " + formatPrice(catalogStats.max, locale), label: t("home.statPrices") },
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
          <h1 className="font-display text-balance text-5xl leading-[1] sm:text-6xl lg:text-7xl">{t("home.heroTitle")}</h1>
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

        <div className="relative mx-auto flex w-full max-w-md items-end justify-center gap-4 animate-fade-in [animation-delay:200ms] lg:max-w-lg">
          <div className="w-[26%] opacity-80">
            <BottlePlaceholder brand="XERJOFF" label="" transparent />
          </div>
          <div className="w-[36%]">
            <BottlePlaceholder brand="BYREDO" label="" transparent />
          </div>
          <div className="w-[30%] opacity-90">
            <BottlePlaceholder brand="TOM FORD" label="" transparent />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-6 bottom-[8%] h-px bg-gradient-to-r from-transparent via-line-strong to-transparent"
          />
        </div>
      </div>
    </section>
  );
}
