"use client";

import Link from "next/link";
import { useI18n } from "@/components/providers/i18n-provider";
import { ProductImage } from "@/components/product/product-image";
import { PlusIcon } from "@/components/ui/icons";
import { formatPrice } from "@/lib/format";
import { concentrationShort } from "@/lib/i18n/labels";
import { useCart } from "@/store/cart";
import type { Product } from "@/types/product";

interface Props {
  product: Product;
  priority?: boolean;
  sizes?: string;
}

export function ProductCard({
  product,
  priority = false,
  sizes = "(min-width: 1024px) 270px, (min-width: 640px) 33vw, 50vw",
}: Props) {
  const { locale, t } = useI18n();
  const add = useCart((s) => s.add);
  const href = "/" + locale + "/mehsul/" + product.slug;

  return (
    <article className="group flex flex-col">
      <div className="relative">
        <Link href={href} tabIndex={-1} aria-hidden="true" className="block">
          <ProductImage product={product} sizes={sizes} priority={priority} />
        </Link>
        <button
          type="button"
          onClick={() => add(product.slug)}
          aria-label={t("product.addToCart") + ": " + product.brand + " " + product.name + " " + product.volumeMl + " ml"}
          className="absolute inset-x-0 bottom-0 z-10 flex h-11 translate-y-2 items-center justify-center gap-2 border-t border-line bg-ink/85 caption text-cream opacity-0 backdrop-blur transition-[opacity,transform] duration-500 ease-soft hover:text-brass-2 focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 pointer-coarse:translate-y-0 pointer-coarse:opacity-100"
        >
          <PlusIcon size={16} />
          {t("product.addToCart")}
        </button>
      </div>
      <div className="mt-4 flex flex-col gap-1">
        <p className="caption text-cream-3">{product.brand}</p>
        <h3 className="font-display text-lg leading-snug">
          <Link href={href} className="after:absolute after:inset-0 after:content-['']">
            {product.name}
          </Link>
        </h3>
        <p className="text-sm text-cream-2">
          {product.volumeMl} {t("common.ml")} · {concentrationShort(product.concentration, t)}
        </p>
        <p className="mt-1 text-sm">{formatPrice(product.priceAzn, locale)}</p>
      </div>
    </article>
  );
}
