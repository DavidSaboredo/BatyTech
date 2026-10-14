"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { GeekCatSticker } from "@/components/GeekCatSticker";
import { formatMoney } from "@/lib/money";
import { productImageUrl } from "@/lib/product-image";

const qtyButton =
  "inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-base font-semibold text-zinc-900 hover:border-amber-400 hover:text-amber-600";

export default function CartPage() {
  const { items, ready, totalCents, totalQuantity, setQuantity, removeItem, clear } = useCart();

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
      <div className="surface-card mx-auto flex w-full max-w-xl flex-col items-center gap-3 rounded-3xl px-6 py-10 text-center">
        <GeekCatSticker name="thinking" size={120} />
        <h1 className="section-heading text-2xl font-semibold text-zinc-950">Tu carrito está vacío</h1>
        <p className="muted-copy max-w-sm text-sm">
          Todavía no agregaste productos. Recorré el catálogo y sumá lo que necesitás para tu setup.
        </p>
        <Link
          href="/products"
          className="mt-2 inline-flex min-h-11 items-center rounded-full border border-zinc-900 bg-zinc-900 px-5 text-sm font-semibold text-white hover:border-amber-400 hover:text-amber-300"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="section-heading text-2xl font-semibold text-amber-300 sm:text-3xl">Carrito</h1>
          <p className="text-sm text-amber-100/90">Revisá las cantidades y, cuando esté todo listo, finalizá tu compra.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (!window.confirm("¿Querés vaciar el carrito?")) return;
            clear();
          }}
          className="shrink-0 text-sm text-amber-100/80 hover:text-amber-300 hover:underline underline-offset-4"
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
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/products/${item.slug}`}
                    className="line-clamp-2 text-sm font-semibold text-zinc-900 hover:text-amber-700 sm:text-base"
                  >
                    {item.name}
                  </Link>
                  <div className="shrink-0 text-sm font-semibold text-zinc-950 sm:text-base">
                    {formatMoney(item.priceCents * item.quantity)}
                  </div>
                </div>
                <div className="text-xs text-zinc-500">{formatMoney(item.priceCents)} c/u</div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(item.productId, item.quantity - 1)}
                    className={qtyButton}
                    aria-label={`Restar una unidad de ${item.name}`}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={999}
                    value={item.quantity}
                    onChange={(e) => setQuantity(item.productId, Number(e.target.value))}
                    aria-label={`Cantidad de ${item.name}`}
                    className="h-9 w-14 rounded-xl border border-zinc-200 px-2 text-center text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(item.productId, item.quantity + 1)}
                    className={qtyButton}
                    aria-label={`Sumar una unidad de ${item.name}`}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="ml-auto text-sm text-zinc-500 hover:text-red-600 hover:underline underline-offset-4"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="surface-card rounded-3xl p-5 lg:sticky lg:top-24">
          <div className="text-sm font-semibold text-zinc-900">Resumen</div>
          <div className="mt-3 flex items-center justify-between text-sm text-zinc-600">
            <span>Productos</span>
            <span>{totalQuantity}</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-zinc-200 pt-3">
            <span className="text-sm text-zinc-600">Total</span>
            <span className="text-xl font-bold text-zinc-950">{formatMoney(totalCents)}</span>
          </div>
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
            El precio final y el stock se confirman al generar el pedido.
          </p>
        </div>
      </div>
    </div>
  );
}
