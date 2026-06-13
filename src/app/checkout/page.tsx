"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { formatMoney } from "@/lib/money";
import { buildWhatsAppLink, buildWhatsAppMessage } from "@/lib/whatsapp";

type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "done"; orderId: string; whatsappUrl: string }
  | { state: "error"; message: string };

export default function CheckoutPage() {
  const { items, totalCents, clear } = useCart();
  const [status, setStatus] = useState<Status>({ state: "idle" });

  const payloadItems = useMemo(
    () => items.map((x) => ({ productId: x.productId, quantity: x.quantity })),
    [items],
  );

  if (status.state === "done") {
    return (
      <div className="surface-card rounded-3xl p-8">
        <h1 className="section-heading text-2xl font-semibold text-zinc-950">Orden creada</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Orden creada: <span className="font-medium text-zinc-900">{status.orderId}</span>
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={status.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-full border border-zinc-900 bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:border-amber-400 hover:text-amber-300"
          >
            Abrir WhatsApp
          </a>
          <Link
            href="/products"
            className="inline-flex rounded-full border border-zinc-900 bg-white px-5 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-900 hover:text-white"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="surface-card rounded-3xl p-8">
        <h1 className="section-heading text-2xl font-semibold text-zinc-950">Checkout</h1>
        <p className="muted-copy mt-2 text-sm">Tu carrito está vacío.</p>
        <Link
          href="/products"
          className="mt-4 inline-flex rounded-full border border-zinc-900 bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:border-amber-400 hover:text-amber-300"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="surface-card rounded-3xl p-5 lg:col-span-2 sm:p-6">
        <h1 className="section-heading text-2xl font-semibold text-zinc-950">Checkout</h1>
        <p className="muted-copy mt-1 text-sm">Completá tus datos y abrimos WhatsApp con la orden lista para enviar.</p>

        <form
          className="mt-5 grid gap-3"
          onSubmit={async (e) => {
            e.preventDefault();
            if (status.state === "submitting") return;
            const form = new FormData(e.currentTarget);
            const customerName = String(form.get("customerName") || "").trim();
            const email = String(form.get("email") || "").trim();
            const phone = String(form.get("phone") || "").trim();
            const address = String(form.get("address") || "").trim();

            if (!customerName || !email || !phone) {
              setStatus({ state: "error", message: "Completá nombre, email y teléfono" });
              return;
            }

            setStatus({ state: "submitting" });
            try {
              const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                  customer: { customerName, email, phone, address },
                  items: payloadItems,
                }),
              });

              const data = (await res.json()) as { orderId?: string; error?: string };
              if (!res.ok) {
                setStatus({ state: "error", message: data.error || "Error" });
                return;
              }
              const orderId = data.orderId || "OK";
              const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
              const message = buildWhatsAppMessage({
                storeName: "BatysTech",
                orderId,
                customer: { customerName, email, phone, address },
                items: items.map((i) => ({
                  name: i.name,
                  quantity: i.quantity,
                  unitPriceCents: i.priceCents,
                })),
                totalCents,
                formatMoney,
              });
              const whatsappUrl = buildWhatsAppLink({ number: whatsappNumber, message });
              if (!whatsappUrl) {
                setStatus({ state: "error", message: "Falta configurar el número de WhatsApp" });
                return;
              }
              clear();
              setStatus({ state: "done", orderId, whatsappUrl });
              window.open(whatsappUrl, "_blank", "noopener,noreferrer");
            } catch {
              setStatus({ state: "error", message: "No se pudo completar la compra" });
            }
          }}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Nombre</label>
              <input
                name="customerName"
                required
                className="h-10 rounded-xl border px-3 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Email</label>
              <input
                name="email"
                type="email"
                required
                className="h-10 rounded-xl border px-3 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Teléfono</label>
              <input
                name="phone"
                required
                className="h-10 rounded-xl border px-3 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-sm font-medium">Dirección</label>
              <input
                name="address"
                className="h-10 rounded-xl border px-3 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </div>
          </div>

          {status.state === "error" ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {status.message}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={status.state === "submitting"}
            className="mt-2 rounded-full border border-zinc-900 bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:border-amber-400 hover:text-amber-300 disabled:opacity-40"
          >
            {status.state === "submitting" ? "Procesando..." : "Confirmar por WhatsApp"}
          </button>
          <Link href="/cart" className="text-sm text-zinc-600 hover:text-amber-600 hover:underline underline-offset-4">
            Volver al carrito
          </Link>
        </form>
      </div>

      <div className="surface-card rounded-3xl p-5">
        <div className="text-sm font-semibold text-zinc-900">Resumen</div>
        <div className="mt-3 flex flex-col gap-2">
          {items.map((i) => (
            <div key={i.productId} className="flex items-center justify-between text-sm">
              <div className="text-zinc-700">
                {i.name} × {i.quantity}
              </div>
              <div className="font-medium">{formatMoney(i.priceCents * i.quantity)}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <div className="text-sm text-zinc-600">Total</div>
          <div className="text-lg font-semibold">{formatMoney(totalCents)}</div>
        </div>
        <div className="mt-3 text-xs text-zinc-500">
          Al confirmar, se genera la orden y se abre WhatsApp con el mensaje listo para enviar.
        </div>
      </div>
    </div>
  );
}
