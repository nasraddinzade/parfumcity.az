import { getProduct } from "@/lib/catalog";
import { site } from "@/lib/site";
import type { CartDelivery, CartItem } from "@/store/cart";
import type { Product } from "@/types/product";

export interface CartLine {
  product: Product;
  qty: number;
}

export type DeliveryMethod = "pickup" | "wolt" | "courier";

export function getCartLines(items: readonly CartItem[]): CartLine[] {
  const lines: CartLine[] = [];
  for (const item of items) {
    const product = getProduct(item.slug);
    if (product) lines.push({ product, qty: item.qty });
  }
  return lines;
}

export function getSubtotal(lines: readonly CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.product.priceAzn * l.qty, 0);
}

/** Courier price is agreed by phone and is not part of the total, so it counts as 0 here. */
export function getDeliveryFee(method: DeliveryMethod | CartDelivery): number {
  return method === "wolt" ? site.woltFeeAzn : 0;
}

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function getTotals(lines: readonly CartLine[], method: DeliveryMethod | CartDelivery) {
  const subtotal = getSubtotal(lines);
  const delivery = getDeliveryFee(method);
  return { subtotal, delivery, total: roundMoney(subtotal + delivery) };
}
