"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { maxAvailableLabel, maxCartQuantity, useCart, type CartItem } from "@/components/CartProvider";
import { GeekCatSticker } from "@/components/GeekCatSticker";
import { formatMoney } from "@/lib/money";
import { productImageUrl } from "@/lib/product-image";
import { shippingCostFor, storeTerms, transferPrice } from "@/lib/store-terms";

const qtyButton =
  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-lg font-semibold text-zinc-900 hover:border-amber-400 hover:text-amber-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-zinc-200 disabled:hover:text-zinc-900";

type RemovedItem = { item: CartItem; index: number };

/** La cantidad se aplica al salir del campo o con Enter: borrar el número ya no quita el producto. */
function QuantityInput({ item, onCommit }: { item: CartItem; onCommit: (quantity: number) => void }) {
  const [draft, setDraft] = useState<string | null>(null);

  const commit = () => {
    if (draft === null) return;
    const next = Math.floor(Number(draft));
    // Vacío o inválido: vuelve a la cantidad que tenía. Cero o negativo queda en 1; de más, en el stock disponible.
    if (draft.trim() !== "" && Number.isFinite(next)) onCommit(Math.min(Math.max(1, next), maxCartQuantity(item)));
    setDraft(null);
  };

  return (
    <input
      type="number"
      inputMode="numeric"
      min={1}
      max={maxCartQuantity(item)}
      value={draft ?? String(item.quantity)}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
        if (e.key === "Escape") setDraft(null);
      }}
      aria-label={`Cantidad de ${item.name}`}
      className="h-11 w-12 rounded-xl border border-zinc-200 px-1 text-center text-base focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
    />
  );
}

/** Aviso de stock bajo los controles: solo aparece si llegó al máximo o si el stock cambió. */
function StockNote({ item }: { item: CartItem }) {
  if (typeof item.stock !== "number") return null;
  if (item.stock <= 0) {
    return <p className="text-xs font-medium text-red-600">Sin stock por ahora. Quitalo para poder confirmar el pedido.</p>;
  }
  if (item.quantity > item.stock) {
    return (
      <p className="text-xs font-medium text-red-600">
        {item.stock === 1 ? "Queda 1 unidad" : `Quedan ${item.stock} unidades`}. Bajá la cantidad para poder confirmar.
      </p>
    );
  }
  if (item.quantity === item.stock) return <p className="text-xs text-zinc-500">{maxAvailableLabel(item.stock)}</p>;
  return null;
}

export default function CartPage() {
  const { items, ready, totalCents, totalQuantity, setQuantity, removeItem, restoreItem, clear } = useCart();
  const [removed, setRemoved] = useState<RemovedItem | null>(null);

  // El aviso para deshacer queda unos segundos y después se va solo.
  useEffect(() => {
    if (!removed) return;
    const id = setTimeout(() => setRemoved(null), 10000);
    return () => clearTimeout(id);
  }, [removed]);

  // Aviso fijo abajo: es el primer hijo en las dos vistas (con y sin productos) para que React lo conserve
  // y el lector de pantalla lo anuncie aunque se haya quitado el último producto. Al ser fixed no suma espacio.
  const undoNotice = (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
    >
      {removed ? (
        <div className="pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-2xl border border-amber-300/40 bg-zinc-950 py-1.5 pl-4 pr-1.5 text-sm text-zinc-200 shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
          <span className="line-clamp-2 min-w-0 flex-1">
            Quitaste <span className="font-semibold text-white">{removed.item.name}</span> del carrito.
          </span>
          <button
            type="button"
            onClick={() => {
              restoreItem(removed.item, removed.index);
              setRemoved(null);
            }}
            className="inline-flex min-h-11 shrink-0 items-center rounded-full px-4 font-semibold text-amber-300 hover:bg-white/10"
          >
            Deshacer
          </button>
        </div>
      ) : null}
    </div>
  );

  if (!ready) {
    return (
      <div className="surface-card flex flex-col gap-3 rounded-3xl p-6 sm:p-8" aria-busy="true">
        <div className="h-7 w-40 animate-pulse rounded-full bg-zinc-200" />
        <div className="h-4 w-64 max-w-full animate-pulse rounded-full bg-zinc-100" />
        <div className="h-24 w-full animate-pulse rounded-2xl bg-zinc-100" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        {undoNotice}
        <div className="surface-card mx-auto flex w-full max-w-xl flex-col items-center gap-3 rounded-3xl px-6 py-10 text-center">
          <GeekCatSticker name="thinking" size={120} />
          <h1 className="section-heading text-2xl font-semibold text-zinc-950">Tu carrito está vacío</h1>
          <p className="muted-copy max-w-sm text-sm">
            No hay productos en tu carrito. Recorré el catálogo y sumá lo que necesitás para tu setup.
          </p>
          <Link
            href="/products"
            className="mt-2 inline-flex min-h-11 items-center rounded-full border border-zinc-900 bg-zinc-900 px-5 text-sm font-semibold text-white hover:border-amber-400 hover:text-amber-300"
          >
            Ver productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {undoNotice}
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="section-heading text-2xl font-semibold text-amber-300 sm:text-3xl">Carrito</h1>
          <p className="text-sm text-amber-100/90">Revisá las cantidades y, cuando esté todo listo, finalizá tu compra.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (!window.confirm("¿Querés vaciar el carrito?")) return;
            setRemoved(null);
            clear();
          }}
          className="inline-flex min-h-11 shrink-0 items-center text-sm text-amber-100/90 hover:text-amber-300 hover:underline underline-offset-4"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 lg:items-start">
        <ul className="flex flex-col gap-3 lg:col-span-2">
          {items.map((item) => (
            <li key={item.productId} className="surface-card flex gap-3 rounded-3xl p-3 sm:gap-4 sm:p-4">
              <Link
                href={`/products/${item.slug}`}
                tabIndex={-1}
                aria-hidden="true"
                className="relative h-20 w-20 flex-none overflow-hidden rounded-2xl bg-zinc-50 sm:h-24 sm:w-24"
              >
                <Image src={productImageUrl(item.imageUrl)} alt="" fill sizes="96px" className="object-contain p-2.5" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <Link
                  href={`/products/${item.slug}`}
                  className="line-clamp-2 text-sm font-semibold text-zinc-900 hover:text-amber-700 sm:text-base"
                >
                  {item.name}
                </Link>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <span className="text-xs text-zinc-500">{formatMoney(item.priceCents)} c/u</span>
                  <span className="text-sm font-semibold text-zinc-950 sm:text-base">
                    {formatMoney(item.priceCents * item.quantity)}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setQuantity(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className={qtyButton}
                      aria-label={`Restar una unidad de ${item.name}`}
                    >
                      −
                    </button>
                    <QuantityInput item={item} onCommit={(quantity) => setQuantity(item.productId, quantity)} />
                    <button
                      type="button"
                      onClick={() => setQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= maxCartQuantity(item)}
                      className={qtyButton}
                      aria-label={`Sumar una unidad de ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setRemoved({ item, index: items.findIndex((x) => x.productId === item.productId) });
                      removeItem(item.productId);
                    }}
                    className="-mr-2 inline-flex min-h-11 items-center rounded-full px-2 text-sm text-zinc-500 hover:text-red-600 hover:underline underline-offset-4"
                  >
                    Quitar
                  </button>
                </div>
                <StockNote item={item} />
              </div>
            </li>
          ))}
        </ul>

        <div className="surface-card rounded-3xl p-5 lg:sticky lg:top-24">
          <div className="text-sm font-semibold text-zinc-900">Resumen</div>
          <div className="mt-3 flex items-baseline justify-between gap-3">
            <span className="text-sm text-zinc-600">
              Subtotal · {totalQuantity} {totalQuantity === 1 ? "producto" : "productos"}
            </span>
            <span className="text-xl font-bold text-zinc-950">{formatMoney(totalCents)}</span>
          </div>
          {storeTerms.transferDiscountPercent > 0 ? (
            <p className="mt-1 text-right text-xs text-zinc-500">
              o {formatMoney(transferPrice(totalCents))} pagando por transferencia
            </p>
          ) : null}
          <p className="mt-3 border-t border-zinc-200 pt-3 text-sm leading-6 text-zinc-600">
            {shippingCostFor(totalCents) === 0 ? (
              <>
                <span className="font-semibold text-zinc-900">Envío gratis</span> o retiro sin cargo.
              </>
            ) : (
              <>
                Envío <span className="font-semibold text-zinc-900">{formatMoney(storeTerms.shippingCost)}</span> o
                retiro sin cargo.
              </>
            )}{" "}
            Lo elegís en el siguiente paso.
          </p>
          <Link
            href="/checkout"
            className="mt-4 flex min-h-11 w-full items-center justify-center rounded-full border border-zinc-900 bg-zinc-900 px-5 text-sm font-semibold text-white hover:border-amber-400 hover:text-amber-300"
          >
            Finalizar compra
          </Link>
          <Link
            href="/products"
            className="mt-3 flex min-h-11 w-full items-center justify-center rounded-full border border-zinc-300 bg-white px-5 text-sm font-semibold text-zinc-900 hover:border-zinc-900"
          >
            Seguir comprando
          </Link>
          <p className="mt-3 text-xs leading-5 text-zinc-500">
            <span className="font-semibold text-zinc-700">No pagás ahora.</span> Confirmás el pedido y coordinamos el pago
            y la entrega por WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
}
