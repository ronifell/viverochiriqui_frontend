'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem, Product } from './types';

interface CartState {
  items: CartItem[];
  note: string;
  add: (product: Product, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  increment: (productId: string, by?: number) => void;
  decrement: (productId: string, by?: number) => void;
  setNote: (note: string) => void;
  clear: () => void;
  totalItems: () => number;
  totalEstimate: (isWholesale: boolean) => number;
}

const fromProduct = (p: Product, qty: number): CartItem => ({
  product_id: p.id,
  name_es: p.name_es,
  name_en: p.name_en,
  pot_size: p.pot_size,
  retail_price: p.retail_price,
  wholesale_price: p.wholesale_price,
  image_url:
    p.images.find((i) => i.is_primary)?.url || p.images[0]?.url || null,
  qty,
});

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      note: '',
      add: (product, qty = 1) => {
        const existing = get().items.find(
          (i) => i.product_id === product.id
        );
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.product_id === product.id
                ? { ...i, qty: i.qty + qty }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, fromProduct(product, qty)] });
        }
      },
      remove: (productId) =>
        set({
          items: get().items.filter((i) => i.product_id !== productId),
        }),
      setQty: (productId, qty) =>
        set({
          items: get()
            .items.map((i) =>
              i.product_id === productId
                ? { ...i, qty: Math.max(1, Math.floor(qty)) }
                : i
            )
            .filter((i) => i.qty > 0),
        }),
      increment: (productId, by = 1) =>
        set({
          items: get().items.map((i) =>
            i.product_id === productId ? { ...i, qty: i.qty + by } : i
          ),
        }),
      decrement: (productId, by = 1) =>
        set({
          items: get()
            .items.map((i) =>
              i.product_id === productId
                ? { ...i, qty: Math.max(0, i.qty - by) }
                : i
            )
            .filter((i) => i.qty > 0),
        }),
      setNote: (note) => set({ note }),
      clear: () => set({ items: [], note: '' }),
      totalItems: () =>
        get().items.reduce((sum, i) => sum + i.qty, 0),
      totalEstimate: (isWholesale) =>
        get().items.reduce((sum, i) => {
          const price =
            isWholesale && i.wholesale_price
              ? i.wholesale_price
              : i.retail_price;
          return sum + price * i.qty;
        }, 0),
    }),
    {
      name: 'vc-cart',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
