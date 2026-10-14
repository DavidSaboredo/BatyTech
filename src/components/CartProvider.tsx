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
  /** true cuando ya se leyó el carrito guardado en el navegador. */
  ready: boolean;
  totalQuantity: number;
  totalCents: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  /** Nunca quita el producto: la cantidad mínima es 1. Para quitarlo está removeItem. */
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  /** Vuelve a poner un producto quitado en la misma posición (para "Deshacer"). */
  restoreItem: (item: CartItem, index: number) => void;
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
  const [ready, setReady] = useState(false);

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
      } finally {
        setReady(true);
      }
    }, 0);
    return () => clearTimeout(id);
  }, []);

  // Se guarda recién después de leer lo guardado; si no, el primer render pisaba el carrito con [].
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      // Navegación privada o almacenamiento lleno: el carrito sigue funcionando en memoria.
    }
  }, [items, ready]);

  const value = useMemo<CartContextValue>(() => {
    const totalQuantity = items.reduce((acc, x) => acc + x.quantity, 0);
    const totalCents = items.reduce((acc, x) => acc + x.quantity * x.priceCents, 0);

    return {
      items,
      ready,
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
        const qty = clampInt(quantity, 1, 999);
        setItems((prev) => prev.map((x) => (x.productId === productId ? { ...x, quantity: qty } : x)));
      },
      removeItem: (productId) => setItems((prev) => prev.filter((x) => x.productId !== productId)),
      restoreItem: (item, index) =>
        setItems((prev) => {
          // Si mientras tanto lo volvió a agregar, se suman las cantidades en vez de duplicarlo.
          if (prev.some((x) => x.productId === item.productId)) {
            return prev.map((x) =>
              x.productId === item.productId ? { ...x, quantity: clampInt(x.quantity + item.quantity, 1, 999) } : x,
            );
          }
          const next = [...prev];
          next.splice(Math.min(Math.max(index, 0), next.length), 0, item);
          return next;
        }),
      clear: () => setItems([]),
    };
  }, [items, ready]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart tiene que usarse dentro de CartProvider");
  return ctx;
}
