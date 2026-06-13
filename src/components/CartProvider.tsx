"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  priceCents: number;
  imageUrl: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  totalQuantity: number;
  totalCents: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const storageKey = "batytech_cart";

function clampInt(value: number, min: number, max: number) {
  const n = Math.floor(value);
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const id = setTimeout(() => {
      try {
        const raw = localStorage.getItem(storageKey);
        if (!raw) return;
        const parsed = JSON.parse(raw) as CartItem[];
        if (!Array.isArray(parsed)) return;
        setItems(
          parsed
            .filter((x) => x && typeof x.productId === "string")
            .map((x) => ({
              ...x,
              quantity: clampInt(Number(x.quantity ?? 1), 1, 999),
            })),
        );
      } catch {
        setItems([]);
      }
    }, 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const totalQuantity = items.reduce((acc, x) => acc + x.quantity, 0);
    const totalCents = items.reduce((acc, x) => acc + x.quantity * x.priceCents, 0);

    return {
      items,
      totalQuantity,
      totalCents,
      addItem: (item, quantity = 1) => {
        const qty = clampInt(quantity, 1, 999);
        setItems((prev) => {
          const existing = prev.find((x) => x.productId === item.productId);
          if (!existing) return [...prev, { ...item, quantity: qty }];
          return prev.map((x) =>
            x.productId === item.productId ? { ...x, quantity: clampInt(x.quantity + qty, 1, 999) } : x,
          );
        });
      },
      setQuantity: (productId, quantity) => {
        const qty = clampInt(quantity, 0, 999);
        setItems((prev) => {
          if (qty === 0) return prev.filter((x) => x.productId !== productId);
          return prev.map((x) => (x.productId === productId ? { ...x, quantity: qty } : x));
        });
      },
      removeItem: (productId) => setItems((prev) => prev.filter((x) => x.productId !== productId)),
      clear: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
