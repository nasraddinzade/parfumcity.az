"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import { useI18n } from "@/components/providers/i18n-provider";
import { LOCALE_COOKIE, localeNames, locales, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/cn";

const LOCALE_RE = /^\/(az|ru|en)(?=\/|$)/;

export function LangSwitcher({ className, size = "sm" }: { className?: string; size?: "sm" | "lg" }) {
  const { locale, t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  function hrefFor(target: Locale): string {
    return LOCALE_RE.test(pathname) ? pathname.replace(LOCALE_RE, "/" + target) : "/" + target + pathname;
  }

  function onClick(event: MouseEvent<HTMLAnchorElement>, target: Locale) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    document.cookie = LOCALE_COOKIE + "=" + target + "; path=/; max-age=31536000; samesite=lax";
    // Keep catalog filters and anchors when switching language.
    router.push(hrefFor(target) + window.location.search + window.location.hash);
  }

  return (
    <nav aria-label={t("lang.label")} className={cn("flex items-center", size === "lg" ? "gap-6" : "gap-3", className)}>
      {locales.map((l) => (
        <Link
          key={l}
          href={hrefFor(l)}
          hrefLang={l}
          lang={l}
          onClick={(e) => onClick(e, l)}
          aria-current={l === locale ? "true" : undefined}
          aria-label={t("lang.switchTo", { name: localeNames[l] })}
          className={cn(
            "caption transition-colors duration-300",
            size === "lg" ? "text-sm" : "",
            l === locale ? "text-cream" : "text-cream-3 hover:text-cream",
          )}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
