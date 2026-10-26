"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "@/components/providers/i18n-provider";
import { CartButton } from "@/components/layout/cart-button";
import { LangSwitcher } from "@/components/layout/lang-switcher";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

export function Header() {
  const { locale, t } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/" + locale + "/kolleksiya", label: t("nav.catalog") },
    { href: "/" + locale + "/brendler", label: t("nav.brands") },
    { href: "/" + locale + "/butik", label: t("nav.boutique") },
  ];

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur-md">
      <div className="container-x grid h-16 grid-cols-[1fr_auto_1fr] items-center md:h-20 md:grid-cols-[auto_1fr_auto]">
        <button
          type="button"
          className="-ml-2 flex h-11 w-11 items-center justify-center text-cream md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
        </button>

        <Link
          href={"/" + locale}
          className="font-display justify-self-center text-[1.35rem] tracking-[0.04em] text-cream md:justify-self-start md:text-2xl"
          aria-label={t("nav.home")}
        >
          Parfum City
        </Link>

        <nav aria-label={t("nav.home")} className="hidden justify-self-center md:flex md:items-center md:gap-10">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={cn("caption link-line py-2", isActive(l.href) ? "text-cream" : "text-cream-2 hover:text-cream")}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-self-end gap-6">
          <LangSwitcher className="hidden md:flex" />
          <CartButton />
        </div>
      </div>

      <div
        id="mobile-menu"
        inert={!open}
        aria-hidden={!open}
        className={cn(
          "fixed inset-x-0 bottom-0 top-16 z-30 flex flex-col justify-between border-t border-line bg-ink px-4 pb-10 pt-10 transition-[opacity,transform] duration-500 ease-soft md:hidden",
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0",
        )}
      >
        <nav className="flex flex-col gap-6" aria-label={t("nav.home")}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={cn("font-display text-4xl", isActive(l.href) ? "text-brass-2" : "text-cream")}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-6 border-t border-line pt-6">
          <p className="caption text-cream-3">{t("lang.label")}</p>
          <LangSwitcher size="lg" />
        </div>
      </div>
    </header>
  );
}
