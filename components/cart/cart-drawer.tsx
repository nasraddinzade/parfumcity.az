"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { CartLine } from "@/components/cart/cart-line";
import { CartSummary } from "@/components/cart/cart-summary";
import { useI18n } from "@/components/providers/i18n-provider";
import { CloseIcon } from "@/components/ui/icons";
import { getCartLines } from "@/lib/cart";
import { cn } from "@/lib/cn";
import { selectCount, useCart } from "@/store/cart";

export function CartDrawer() {
  const { locale, t } = useI18n();
  const isOpen = useCart((s) => s.isOpen);
  const close = useCart((s) => s.close);
  const items = useCart((s) => s.items);
  const count = useCart(selectCount);
  const pathname = usePathname();
  const closeRef = useRef<HTMLButtonElement>(null);
  const lines = getCartLines(items);

  useEffect(() => {
    close();
    // Close when navigating to a new page.
  }, [pathname, close]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const id = window.setTimeout(() => closeRef.current?.focus(), 350);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(id);
    };
  }, [isOpen, close]);

  return (
    <>
      <div
        aria-hidden="true"
        onClick={close}
        className={cn(
          "fixed inset-0 z-50 bg-ink/70 transition-opacity duration-500 ease-soft",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t("cart.title")}
        inert={!isOpen}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-line bg-ink-2 transition-transform duration-500 ease-soft",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-5 md:h-20">
          <p className="font-display text-2xl">
            {t("cart.title")}
            {count > 0 && <span className="ml-3 align-middle text-sm text-cream-3">{count}</span>}
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label={t("cart.close")}
            className="-mr-2 flex h-11 w-11 items-center justify-center text-cream-2 transition-colors hover:text-cream"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-start justify-center gap-4 px-5">
            <p className="font-display text-2xl">{t("cart.empty")}</p>
            <p className="text-sm text-cream-2">{t("cart.emptyText")}</p>
            <Link href={"/" + locale + "/kolleksiya"} className="btn btn-outline mt-2" onClick={close}>
              {t("cart.continue")}
            </Link>
          </div>
        ) : (
          <>
            <div className="scrollbar-thin flex-1 divide-y divide-line overflow-y-auto px-5">
              {lines.map((line) => (
                <CartLine key={line.product.slug} line={line} compact />
              ))}
            </div>
            <div className="border-t border-line px-5 py-5">
              <CartSummary lines={lines} />
              <div className="mt-5 flex flex-col gap-3">
                <Link href={"/" + locale + "/odenis"} className="btn btn-primary w-full" onClick={close}>
                  {t("cart.checkout")}
                </Link>
                <Link href={"/" + locale + "/sebet"} className="btn btn-outline w-full" onClick={close}>
                  {t("cart.viewCart")}
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
