"use client";

import { useEffect } from "react";
import { useCart } from "@/store/cart";

/** Restores the cart from localStorage after mount, so SSR and first client render match. */
export function CartHydration() {
  useEffect(() => {
    void useCart.persist.rehydrate();
  }, []);
  return null;
}
