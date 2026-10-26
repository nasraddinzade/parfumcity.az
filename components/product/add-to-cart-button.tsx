"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/providers/i18n-provider";
import { CheckIcon } from "@/components/ui/icons";
import { useCart } from "@/store/cart";

export function AddToCartButton({ slug }: { slug: string }) {
  const { t } = useI18n();
  const add = useCart((s) => s.add);
  const inCart = useCart((s) => s.items.find((i) => i.slug === slug)?.qty ?? 0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const id = window.setTimeout(() => setAdded(false), 1600);
    return () => window.clearTimeout(id);
  }, [added]);

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => {
          add(slug);
          setAdded(true);
        }}
        className="btn btn-primary w-full sm:w-auto sm:min-w-64"
      >
        {added ? (
          <>
            <CheckIcon size={16} />
            {t("product.added")}
          </>
        ) : (
          t("product.addToCart")
        )}
      </button>
      <p className="min-h-5 text-xs text-cream-3" aria-live="polite">
        {inCart > 0 ? t("product.inCart", { count: inCart }) : ""}
      </p>
    </div>
  );
}
