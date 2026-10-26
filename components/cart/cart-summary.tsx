"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { getTotals, type CartLine } from "@/lib/cart";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { useCart, type CartDelivery } from "@/store/cart";

export function CartSummary({ lines, className }: { lines: readonly CartLine[]; className?: string }) {
  const { locale, t } = useI18n();
  const delivery = useCart((s) => s.delivery);
  const setDelivery = useCart((s) => s.setDelivery);
  const totals = getTotals(lines, delivery);

  const options: { value: CartDelivery; label: string; price: string }[] = [
    { value: "pickup", label: t("cart.deliveryPickup"), price: t("cart.free") },
    { value: "wolt", label: t("cart.deliveryWolt"), price: formatPrice(0.49, locale) },
  ];

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <fieldset className="flex flex-col gap-2">
        <legend className="caption mb-3 text-cream-3">{t("cart.delivery")}</legend>
        {options.map((o) => (
          <label
            key={o.value}
            className={cn(
              "flex cursor-pointer items-center justify-between gap-4 border px-4 py-3 text-sm transition-colors duration-300",
              delivery === o.value ? "border-cream" : "border-line hover:border-line-strong",
            )}
          >
            <span className="flex items-center gap-3">
              <input
                type="radio"
                name="delivery"
                value={o.value}
                aria-label={o.label}
                checked={delivery === o.value}
                onChange={() => setDelivery(o.value)}
                className="h-4 w-4 accent-[var(--color-brass)]"
              />
              {o.label}
            </span>
            <span className="text-cream-2">{o.price}</span>
          </label>
        ))}
      </fieldset>

      <dl className="flex flex-col gap-2 border-t border-line pt-5 text-sm">
        <div className="flex justify-between">
          <dt className="text-cream-2">{t("cart.subtotal")}</dt>
          <dd>{formatPrice(totals.subtotal, locale)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-cream-2">{t("cart.delivery")}</dt>
          <dd>{totals.delivery === 0 ? t("cart.free") : formatPrice(totals.delivery, locale)}</dd>
        </div>
        <div className="mt-2 flex justify-between border-t border-line pt-4 text-base">
          <dt>{t("cart.total")}</dt>
          <dd className="font-display text-xl">{formatPrice(totals.total, locale)}</dd>
        </div>
      </dl>
    </div>
  );
}
