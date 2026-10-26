import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartDelivery = "pickup" | "wolt";

export interface CartItem {
  slug: string;
  qty: number;
}

interface CartState {
  items: CartItem[];
  delivery: CartDelivery;
  isOpen: boolean;
  /** Increments on every add so the header badge can replay its animation. */
  bump: number;
  hydrated: boolean;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  setDelivery: (delivery: CartDelivery) => void;
  setHydrated: () => void;
}

export const MAX_QTY = 10;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      delivery: "pickup",
      isOpen: false,
      bump: 0,
      hydrated: false,
      add: (slug, qty = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.slug === slug);
          const items = existing
            ? state.items.map((i) => (i.slug === slug ? { ...i, qty: Math.min(MAX_QTY, i.qty + qty) } : i))
            : [...state.items, { slug, qty: Math.min(MAX_QTY, qty) }];
          return { items, isOpen: true, bump: state.bump + 1 };
        }),
      setQty: (slug, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.slug !== slug)
              : state.items.map((i) => (i.slug === slug ? { ...i, qty: Math.min(MAX_QTY, qty) } : i)),
        })),
      remove: (slug) => set((state) => ({ items: state.items.filter((i) => i.slug !== slug) })),
      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      setDelivery: (delivery) => set({ delivery }),
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "parfumcity-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items, delivery: state.delivery }),
      // Hydrate manually after mount so server and client markup match.
      skipHydration: true,
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);

export const selectCount = (state: CartState) => state.items.reduce((sum, i) => sum + i.qty, 0);
