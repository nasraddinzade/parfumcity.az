"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/providers/i18n-provider";
import { BagIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { selectCount, useCart } from "@/store/cart";

export function CartButton() {
  const { t } = useI18n();
  const count = useCart(selectCount);
  const bump = useCart((s) => s.bump);
  const open = useCart((s) => s.open);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (bump === 0) return;
    setAnimate(true);
    const id = window.setTimeout(() => setAnimate(false), 520);
    return () => window.clearTimeout(id);
  }, [bump]);

  return (
    <button
      type="button"
      onClick={open}
      aria-label={count > 0 ? t("cart.itemsInCart", { count }) : t("cart.open")}
      className="relative -mr-2 flex h-11 w-11 items-center justify-center text-cream transition-colors duration-300 hover:text-brass-2"
    >
      <BagIcon size={22} />
      {count > 0 && (
        <span
          aria-hidden="true"
          className={cn(
            "absolute right-0.5 top-1 flex h-[1.1rem] min-w-[1.1rem] items-center justify-center rounded-full bg-brass px-1 text-[0.625rem] font-normal leading-none text-ink",
            animate && "animate-pop",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}
