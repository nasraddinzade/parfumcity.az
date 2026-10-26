import type { DeliveryMethod } from "@/lib/cart";

export interface OrderLine {
  slug: string;
  brand: string;
  name: string;
  volumeMl: number;
  priceAzn: number;
  qty: number;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: { name: string; phone: string; address?: string; note?: string };
  method: DeliveryMethod;
  lines: OrderLine[];
  subtotal: number;
  delivery: number;
  total: number;
  /** Only the last four digits are ever stored; the demo never keeps a full card number. */
  cardLast4: string;
}

const STORAGE_KEY = "parfumcity-orders";

function readAll(): Record<string, Order> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, Order>) : {};
  } catch {
    return {};
  }
}

export function saveOrder(order: Order): void {
  const all = readAll();
  all[order.id] = order;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // Storage may be unavailable (private mode, quota); the confirmation screen still works in-memory.
  }
}

export function getOrder(id: string): Order | null {
  return readAll()[id] ?? null;
}

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function createOrderId(): string {
  let suffix = "";
  const bytes = new Uint8Array(4);
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) crypto.getRandomValues(bytes);
  else for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  for (const b of bytes) suffix += ALPHABET[b % ALPHABET.length];
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  return "PC-" + stamp + suffix;
}
