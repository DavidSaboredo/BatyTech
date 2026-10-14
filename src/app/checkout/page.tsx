"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { GeekCatSticker } from "@/components/GeekCatSticker";
import { formatMoney } from "@/lib/money";
import { buildWhatsAppLink, buildWhatsAppMessage } from "@/lib/whatsapp";

type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "done"; orderId: string; whatsappUrl: string }
  | { state: "error"; message: string };

const primaryButton =
  "inline-flex min-h-11 items-center justify-center rounded-full border border-zinc-900 bg-zinc-900 px-5 text-sm font-semibold text-white hover:border-amber-400 hover:text-amber-300 disabled:opacity-40";
const secondaryButton =
  "inline-flex min-h-11 items-center justify-center rounded-full border border-zinc-300 bg-white px-5 text-sm font-semibold text-zinc-900 hover:border-zinc-900";
const fieldClass =
  "h-11 w-full min-w-0 rounded-xl border border-zinc-200 bg-white px-3 text-base focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200";

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

export default function CheckoutPage() {
  const { items, ready, totalCents, totalQuantity, clear } = useCart();
  const [status, setStatus] = useState<Status>({ state: "idle" });

  const payloadItems = useMemo(
    () => items.map((x) => ({ productId: x.productId, quantity: x.quantity })),
    [items],
  );

  if (status.state === "done") {
    return (
      <div className="surface-card mx-auto flex w-full max-w-xl flex-col items-center gap-3 rounded-3xl px-6 py-10 text-center">
        <GeekCatSticker name="coffee" size={120} />
        <h1 className="section-heading text-2xl font-semibold text-zinc-950">¡Pedido generado!</h1>
        <p className="muted-copy max-w-sm text-sm leading-6">
          Envianos el mensaje de WhatsApp que se abrió para coordinar el pago y la entrega. Si no se abrió, tocá el botón
          de abajo.
        </p>
        <div className="w-full max-w-sm rounded-2xl bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
          Número de pedido
          <div className="mt-0.5 break-all font-mono text-sm font-semibold text-zinc-900">{status.orderId}</div>
        </div>
        <div className="mt-2 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <a href={status.whatsappUrl} target="_blank" rel="noopener noreferrer" className={primaryButton}>
            Enviar pedido por WhatsApp
          </a>
          <Link href="/products" className={secondaryButton}>
            Seguir comprando
          </Link>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="surface-card flex flex-col gap-3 rounded-3xl p-6 sm:p-8" aria-busy="true">
        <div className="h-7 w-48 animate-pulse rounded-full bg-zinc-200" />
        <div className="h-4 w-64 max-w-full animate-pulse rounded-full bg-zinc-100" />
        <div className="h-40 w-full animate-pulse rounded-2xl bg-zinc-100" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="surface-card mx-auto flex w-full max-w-xl flex-col items-center gap-3 rounded-3xl px-6 py-10 text-center">
        <GeekCatSticker name="thinking" size={120} />
        <h1 className="section-heading text-2xl font-semibold text-zinc-950">No hay productos para comprar</h1>
        <p className="muted-copy max-w-sm text-sm">
          Tu carrito está vacío. Agregá productos desde el catálogo y volvé para finalizar la compra.
        </p>
        <Link href="/products" className={`mt-2 ${primaryButton}`}>
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="section-heading text-2xl font-semibold text-amber-300 sm:text-3xl">Finalizar compra</h1>
        <p className="text-sm text-amber-100/90">
          Completá tus datos: generamos el pedido y abrimos WhatsApp con el detalle listo para enviar.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 lg:items-start">
        <div className="surface-card rounded-3xl p-5 sm:p-6 lg:col-span-2">
          <h2 className="text-sm font-semibold text-zinc-900">Tus datos</h2>

          <form
            className="mt-4 grid gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              if (status.state === "submitting") return;
              const form = new FormData(e.currentTarget);
              const customerName = String(form.get("customerName") || "").trim();
              const email = String(form.get("email") || "").trim();
              const phone = String(form.get("phone") || "").trim();
              const address = String(form.get("address") || "").trim();

              if (!customerName || !email || !phone) {
                setStatus({ state: "error", message: "Completá tu nombre, teléfono y email." });
                return;
              }
              // Se revisa antes de generar el pedido para no descontar stock sin poder avisarle a la tienda.
              if (!buildWhatsAppLink({ number: whatsappNumber, message: "" })) {
                setStatus({
                  state: "error",
                  message: "En este momento no podemos tomar pedidos online. Probá de nuevo más tarde.",
                });
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

                const data = (await res.json().catch(() => ({}))) as { orderId?: string; error?: string };
                if (!res.ok || !data.orderId) {
                  setStatus({
                    state: "error",
                    message: data.error || "No pudimos generar el pedido. Probá de nuevo en unos minutos.",
                  });
                  return;
                }
                const orderId = data.orderId;
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
                clear();
                setStatus({ state: "done", orderId, whatsappUrl });
                window.open(whatsappUrl, "_blank", "noopener,noreferrer");
              } catch {
                setStatus({
                  state: "error",
                  message: "No pudimos conectarnos. Revisá tu conexión y probá de nuevo.",
                });
              }
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="checkout-name" className="text-sm font-medium text-zinc-800">
                  Nombre y apellido
                </label>
                <input id="checkout-name" name="customerName" autoComplete="name" required className={fieldClass} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="checkout-phone" className="text-sm font-medium text-zinc-800">
                  Teléfono / WhatsApp
                </label>
                <input
                  id="checkout-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="Ej: 11 2345-6789"
                  required
                  className={fieldClass}
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label htmlFor="checkout-email" className="text-sm font-medium text-zinc-800">
                  Email
                </label>
                <input
                  id="checkout-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="tu@email.com"
                  required
                  className={fieldClass}
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label htmlFor="checkout-address" className="text-sm font-medium text-zinc-800">
                  Dirección de envío <span className="font-normal text-zinc-500">(opcional)</span>
                </label>
                <input
                  id="checkout-address"
                  name="address"
                  autoComplete="street-address"
                  placeholder="Calle, número y localidad"
                  className={fieldClass}
                />
              </div>
            </div>

            {status.state === "error" ? (
              <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                {status.message}
              </div>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
              <button type="submit" disabled={status.state === "submitting"} className={primaryButton}>
                {status.state === "submitting" ? "Generando pedido..." : "Confirmar pedido por WhatsApp"}
              </button>
              <Link
                href="/cart"
                className="text-center text-sm text-zinc-600 hover:text-amber-600 hover:underline underline-offset-4"
              >
                Volver al carrito
              </Link>
            </div>
          </form>
        </div>

        <div className="surface-card rounded-3xl p-5 lg:sticky lg:top-24">
          <div className="text-sm font-semibold text-zinc-900">
            Tu pedido · {totalQuantity} {totalQuantity === 1 ? "producto" : "productos"}
          </div>
          <ul className="mt-3 flex flex-col gap-2">
            {items.map((i) => (
              <li key={i.productId} className="flex items-start justify-between gap-3 text-sm">
                <span className="min-w-0 text-zinc-700">
                  {i.name} <span className="whitespace-nowrap text-zinc-500">× {i.quantity}</span>
                </span>
                <span className="shrink-0 font-medium text-zinc-900">{formatMoney(i.priceCents * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4">
            <span className="text-sm text-zinc-600">Total</span>
            <span className="text-xl font-bold text-zinc-950">{formatMoney(totalCents)}</span>
          </div>
          <p className="mt-3 text-xs leading-5 text-zinc-500">
            Al confirmar reservamos el stock y se abre WhatsApp con el detalle. Por ahí coordinamos el pago y la entrega.
          </p>
        </div>
      </div>
    </div>
  );
}
