"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { formatMoney } from "@/lib/money";

export default function CartPage() {
  const { items, totalCents, setQuantity, removeItem, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border bg-white p-6">
        <h1 className="text-xl font-semibold">Carrito</h1>
        <p className="mt-2 text-sm text-zinc-600">Todavía no agregaste productos.</p>
        <Link
          href="/products"
          className="mt-4 inline-flex rounded-full border border-amber-400 bg-amber-400 px-5 py-2 text-sm font-semibold text-zinc-900 hover:bg-amber-300"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Carrito</h1>
        <button
          type="button"
          onClick={() => {
            if (items.length === 0) return;
            if (!window.confirm("¿Querés vaciar el carrito?")) return;
            clear();
          }}
          className="text-sm text-zinc-600 hover:text-amber-600 hover:underline underline-offset-4"
        >
          Vaciar
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-3 lg:col-span-2">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-3 rounded-2xl border bg-white p-4">
              <div className="relative h-20 w-20 flex-none overflow-hidden rounded-xl bg-zinc-50">
                <Image src={item.imageUrl} alt={item.name} fill className="object-contain p-3" />
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <Link href={`/products/${item.slug}`} className="font-medium hover:underline">
                  {item.name}
                </Link>
                <div className="text-sm text-zinc-600">{formatMoney(item.priceCents)}</div>
                <div className="mt-2 flex items-center gap-2">
                  <label className="text-sm text-zinc-600">Cantidad</label>
                  <button
                    type="button"
                    onClick={() => setQuantity(item.productId, item.quantity - 1)}
                    className="h-9 w-9 rounded-full border border-amber-200 text-sm font-semibold text-zinc-900 hover:bg-amber-50"
                    aria-label={`Restar una unidad de ${item.name}`}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={999}
                    value={item.quantity}
                    onChange={(e) => setQuantity(item.productId, Number(e.target.value))}
                    className="h-9 w-16 rounded-xl border px-3 text-center text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(item.productId, item.quantity + 1)}
                    className="h-9 w-9 rounded-full border border-amber-200 text-sm font-semibold text-zinc-900 hover:bg-amber-50"
                    aria-label={`Sumar una unidad de ${item.name}`}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="ml-auto text-sm text-zinc-600 hover:text-amber-600 hover:underline underline-offset-4"
                  >
                    Quitar
                  </button>
                </div>
              </div>
              <div className="text-right text-sm font-medium">{formatMoney(item.priceCents * item.quantity)}</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border bg-white p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-600">Total</span>
            <span className="text-lg font-semibold">{formatMoney(totalCents)}</span>
          </div>
          <Link
            href="/checkout"
            className="mt-4 flex w-full items-center justify-center rounded-full border border-amber-400 bg-amber-400 px-5 py-2 text-sm font-semibold text-zinc-900 hover:bg-amber-300"
          >
            Ir a checkout
          </Link>
          <Link
            href="/products"
            className="mt-3 flex w-full items-center justify-center rounded-full border border-zinc-900 bg-white px-5 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-900 hover:text-white"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
