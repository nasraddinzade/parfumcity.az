"use client";

import Link from "next/link";
import { CartLine } from "@/components/cart/cart-line";
import { CartSummary } from "@/components/cart/cart-summary";
import { useI18n } from "@/components/providers/i18n-provider";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCartLines } from "@/lib/cart";
import { useCart } from "@/store/cart";

export function CartPage() {
  const { locale, t } = useI18n();
  const items = useCart((s) => s.items);
  const hydrated = useCart((s) => s.hydrated);
  const clear = useCart((s) => s.clear);
  const lines = getCartLines(items);

  return (
    <div className="container-x py-12 md:py-16">
      <SectionHeading as="h1" eyebrow={t("nav.cart")} title={t("cart.title")} />

      {!hydrated ? (
        <div className="mt-12 h-40" aria-busy="true" />
      ) : lines.length === 0 ? (
        <div className="mt-12 flex flex-col items-start gap-4 border-t border-line pt-10">
          <p className="font-display text-2xl">{t("cart.empty")}</p>
          <p className="text-cream-2">{t("cart.emptyText")}</p>
          <Link href={"/" + locale + "/kolleksiya"} className="btn btn-outline mt-2">
            {t("cart.continue")}
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
          <div>
            <div className="divide-y divide-line border-y border-line">
              {lines.map((line) => (
                <CartLine key={line.product.slug} line={line} />
              ))}
            </div>
            <div className="mt-6 flex justify-between">
              <Link href={"/" + locale + "/kolleksiya"} className="link-line text-sm text-cream-2 hover:text-cream">
                {t("cart.continue")}
              </Link>
              <button type="button" onClick={clear} className="link-line text-sm text-cream-3 hover:text-cream">
                {t("cart.clear")}
              </button>
            </div>
          </div>
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <CartSummary lines={lines} />
            <Link href={"/" + locale + "/odenis"} className="btn btn-primary mt-6 w-full">
              {t("cart.checkout")}
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
