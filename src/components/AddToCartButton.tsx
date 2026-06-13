"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/components/CartProvider";

export function AddToCartButton({
  product,
  className,
  showQuantitySelector = false,
}: {
  product: { id: string; name: string; slug: string; priceCents: number; imageUrl: string; stock: number };
  className?: string;
  showQuantitySelector?: boolean;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const disabled = product.stock <= 0;
  const maxQuantity = Math.max(1, Math.min(product.stock, 99));
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!added) return;
    const id = setTimeout(() => setAdded(false), 1200);
    return () => clearTimeout(id);
  }, [added]);

  useEffect(() => {
    setQuantity((current) => Math.min(current, maxQuantity));
  }, [maxQuantity]);

  const buttonClassName =
    className ??
    "inline-flex min-h-10 items-center justify-center rounded-full border border-zinc-900 bg-zinc-900 px-4 py-2 text-center text-sm font-semibold leading-tight whitespace-nowrap text-white hover:border-amber-400 hover:text-amber-300 disabled:opacity-40";

  const handleAdd = () => {
    addItem(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        priceCents: product.priceCents,
        imageUrl: product.imageUrl,
      },
      quantity,
    );
    setAdded(true);
  };

  if (showQuantitySelector) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-600">Cantidad</span>
          <button
            type="button"
            disabled={disabled || quantity <= 1}
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            className="h-10 w-10 rounded-full border border-zinc-200 text-sm font-semibold text-zinc-900 hover:border-amber-400 hover:text-amber-600 disabled:opacity-40"
          >
            -
          </button>
          <input
            type="number"
            min={1}
            max={maxQuantity}
            value={quantity}
            disabled={disabled}
            onChange={(e) => {
              const next = Math.floor(Number(e.target.value));
              if (!Number.isFinite(next)) return setQuantity(1);
              setQuantity(Math.max(1, Math.min(maxQuantity, next)));
            }}
            className="h-10 w-16 rounded-xl border border-zinc-200 px-2 text-center text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
          />
          <button
            type="button"
            disabled={disabled || quantity >= maxQuantity}
            onClick={() => setQuantity((current) => Math.min(maxQuantity, current + 1))}
            className="h-10 w-10 rounded-full border border-zinc-200 text-sm font-semibold text-zinc-900 hover:border-amber-400 hover:text-amber-600 disabled:opacity-40"
          >
            +
          </button>
        </div>
        <button type="button" disabled={disabled} onClick={handleAdd} className={buttonClassName}>
          {disabled ? "Sin stock" : added ? "Agregado" : "Agregar al carrito"}
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleAdd}
      className={buttonClassName}
    >
      {disabled ? "Sin stock" : added ? "Agregado" : "Agregar al carrito"}
    </button>
  );
}
