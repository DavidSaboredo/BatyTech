"use client";

import { useEffect, useState } from "react";
import { maxAvailableLabel, useCart } from "@/components/CartProvider";

export function AddToCartButton({
  product,
  className,
  showQuantitySelector = false,
  compact = false,
}: {
  product: { id: string; name: string; slug: string; priceCents: number; imageUrl: string; stock: number };
  className?: string;
  showQuantitySelector?: boolean;
  /** En celular muestra "Agregar" para que el botón entre en una línea. */
  compact?: boolean;
}) {
  const { items, addItem } = useCart();
  const [feedback, setFeedback] = useState<"added" | "max" | null>(null);
  const outOfStock = product.stock <= 0;
  const inCart = items.find((x) => x.productId === product.id)?.quantity ?? 0;
  // Lo que todavía se puede sumar sin pasarse del stock (contando lo que ya está en el carrito).
  const remaining = Math.max(0, product.stock - inCart);
  const maxQuantity = Math.max(1, Math.min(remaining, 99));
  const [rawQuantity, setQuantity] = useState(1);
  // Si cambia el stock o lo que hay en el carrito, la cantidad elegida nunca supera el máximo.
  const quantity = Math.min(rawQuantity, maxQuantity);

  useEffect(() => {
    if (!feedback) return;
    const id = setTimeout(() => setFeedback(null), feedback === "max" ? 2200 : 1200);
    return () => clearTimeout(id);
  }, [feedback]);

  const buttonClassName =
    className ??
    "inline-flex min-h-11 items-center justify-center rounded-full border border-zinc-900 bg-zinc-900 px-4 py-2 text-center text-sm font-semibold leading-tight whitespace-nowrap text-white hover:border-amber-400 hover:text-amber-300 disabled:opacity-40";

  const handleAdd = () => {
    const added = addItem(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        priceCents: product.priceCents,
        imageUrl: product.imageUrl,
        stock: product.stock,
      },
      quantity,
    );
    setFeedback(added > 0 ? "added" : "max");
  };

  if (showQuantitySelector) {
    const selectorDisabled = outOfStock || remaining === 0;
    const qtyButton =
      "h-11 w-11 rounded-full border border-zinc-200 text-base font-semibold text-zinc-900 hover:border-amber-400 hover:text-amber-600 disabled:cursor-not-allowed disabled:opacity-40";
    return (
      <div className="flex w-full flex-col gap-3">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-zinc-600">Cantidad</span>
            <button
              type="button"
              disabled={selectorDisabled || quantity <= 1}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              aria-label="Restar uno"
              className={qtyButton}
            >
              −
            </button>
            <input
              type="number"
              min={1}
              max={maxQuantity}
              value={quantity}
              disabled={selectorDisabled}
              aria-label="Cantidad"
              onChange={(e) => {
                const next = Math.floor(Number(e.target.value));
                if (!Number.isFinite(next)) return setQuantity(1);
                setQuantity(Math.max(1, Math.min(maxQuantity, next)));
              }}
              className="h-11 w-16 rounded-xl border border-zinc-200 px-2 text-center text-base focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200 disabled:opacity-40"
            />
            <button
              type="button"
              disabled={selectorDisabled || quantity >= maxQuantity}
              onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
              aria-label="Sumar uno"
              className={qtyButton}
            >
              +
            </button>
          </div>
          <button
            type="button"
            disabled={selectorDisabled}
            onClick={handleAdd}
            aria-live="polite"
            className={`${buttonClassName} w-full justify-center sm:w-auto`}
          >
            {outOfStock ? "Sin stock" : feedback === "added" ? "¡Agregado!" : "Agregar al carrito"}
          </button>
        </div>
        {inCart > 0 ? (
          <p className="text-sm text-zinc-600">
            {remaining > 0
              ? `Ya tenés ${inCart} en el carrito. Podés sumar ${remaining === 1 ? "1 más" : `hasta ${remaining} más`}.`
              : `Ya tenés en el carrito ${
                  product.stock === 1 ? "la única unidad disponible" : `las ${product.stock} unidades disponibles`
                }.`}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled={outOfStock}
      onClick={handleAdd}
      aria-live="polite"
      className={buttonClassName}
    >
      {outOfStock ? (
        "Sin stock"
      ) : feedback === "added" ? (
        "¡Agregado!"
      ) : feedback === "max" ? (
        maxAvailableLabel(product.stock)
      ) : compact ? (
        <>
          <span className="sm:hidden">Agregar</span>
          <span className="max-sm:hidden">Agregar al carrito</span>
        </>
      ) : (
        "Agregar al carrito"
      )}
    </button>
  );
}
