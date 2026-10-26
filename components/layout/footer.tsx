import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { createTranslator } from "@/lib/i18n/t";
import { site } from "@/lib/site";

export function Footer({ locale }: { locale: Locale }) {
  const t = createTranslator(getDictionary(locale));
  const nav = [
    { href: "/" + locale + "/kolleksiya", label: t("nav.catalog") },
    { href: "/" + locale + "/brendler", label: t("nav.brands") },
    { href: "/" + locale + "/butik", label: t("nav.boutique") },
    { href: "/" + locale + "/sebet", label: t("nav.cart") },
  ];

  return (
    <footer className="mt-24 border-t border-line">
      <div className="container-x grid gap-12 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:gap-8 md:py-20">
        <div className="flex flex-col gap-5">
          <p className="font-display text-2xl">Parfum City</p>
          <p className="max-w-md text-sm leading-relaxed text-cream-3">{t("footer.disclaimer")}</p>
        </div>

        <div className="flex flex-col gap-4">
          <p className="caption text-cream-3">{t("footer.nav")}</p>
          <ul className="flex flex-col gap-2">
            {nav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-line text-sm text-cream-2 hover:text-cream">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <p className="caption text-cream-3">{t("footer.contacts")}</p>
          <address className="flex flex-col gap-2 text-sm not-italic text-cream-2">
            <span>{site.address}</span>
            <a href={site.phoneHref} className="link-line w-fit hover:text-cream">
              {site.phone}
            </a>
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="link-line w-fit hover:text-cream">
              Instagram {site.instagramHandle}
            </a>
            <a href={site.wolt} target="_blank" rel="noopener noreferrer" className="link-line w-fit hover:text-cream">
              Wolt
            </a>
          </address>
          <p className="text-sm text-cream-3">
            {t("footer.hours")}: {t("footer.hoursValue")}
          </p>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-cream-3 sm:flex-row sm:items-center sm:justify-between">
          <p>{t("footer.rights")}</p>
          <p>{t("common.since", { year: site.since })}</p>
        </div>
      </div>
    </footer>
  );
}
