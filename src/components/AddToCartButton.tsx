"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/components/CartProvider";

export function AddToCartButton({
  product,
  className,
}: {
  product: { id: string; name: string; slug: string; priceCents: number; imageUrl: string; stock: number };
  className?: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const disabled = product.stock <= 0;

  useEffect(() => {
    if (!added) return;
    const id = setTimeout(() => setAdded(false), 1200);
    return () => clearTimeout(id);
  }, [added]);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        addItem(
          {
            productId: product.id,
            name: product.name,
            slug: product.slug,
            priceCents: product.priceCents,
            imageUrl: product.imageUrl,
          },
          1,
        );
        setAdded(true);
      }}
      className={
        className ??
        "rounded-full border border-amber-400 bg-amber-400 px-5 py-2 text-sm font-semibold text-zinc-900 hover:bg-amber-300 disabled:opacity-40"
      }
    >
      {disabled ? "Sin stock" : added ? "Agregado" : "Agregar al carrito"}
    </button>
  );
}
