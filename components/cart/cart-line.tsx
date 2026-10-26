"use client";

import Link from "next/link";
import { useI18n } from "@/components/providers/i18n-provider";
import { ProductImage } from "@/components/product/product-image";
import { CloseIcon, MinusIcon, PlusIcon } from "@/components/ui/icons";
import type { CartLine as Line } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { MAX_QTY, useCart } from "@/store/cart";

export function CartLine({ line, compact = false }: { line: Line; compact?: boolean }) {
  const { locale, t } = useI18n();
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const { product, qty } = line;
  const href = "/" + locale + "/mehsul/" + product.slug;

  return (
    <div className="flex gap-4 py-5 sm:gap-6">
      <Link href={href} className="w-20 shrink-0 sm:w-24" tabIndex={-1} aria-hidden="true">
        <ProductImage product={product} sizes="96px" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="caption text-cream-3">{product.brand}</p>
        <Link href={href} className="font-display text-lg leading-snug hover:text-brass-2">
          {product.name}
        </Link>
        <p className="text-sm text-cream-2">
          {product.volumeMl} {t("common.ml")} · {product.concentration}
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center border border-line-strong" role="group" aria-label={t("cart.qty")}>
            <button
              type="button"
              onClick={() => setQty(product.slug, qty - 1)}
              aria-label={t("cart.decrease")}
              className="flex h-9 w-9 items-center justify-center text-cream-2 transition-colors hover:text-cream"
            >
              <MinusIcon size={14} />
            </button>
            <span className="min-w-8 text-center text-sm tabular-nums" aria-live="polite">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty(product.slug, qty + 1)}
              disabled={qty >= MAX_QTY}
              aria-label={t("cart.increase")}
              className="flex h-9 w-9 items-center justify-center text-cream-2 transition-colors hover:text-cream disabled:opacity-40"
            >
              <PlusIcon size={14} />
            </button>
          </div>
          <p className={compact ? "text-sm" : "text-base"}>{formatPrice(product.priceAzn * qty, locale)}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => remove(product.slug)}
        aria-label={t("cart.remove") + ": " + product.brand + " " + product.name}
        className="-mr-2 -mt-1 flex h-9 w-9 shrink-0 items-start justify-center pt-2 text-cream-3 transition-colors hover:text-cream"
      >
        <CloseIcon size={16} />
      </button>
    </div>
  );
}
