"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { GeekCatSticker } from "@/components/GeekCatSticker";
import { formatMoney } from "@/lib/money";
import {
  deliveryLabels,
  shippingCostFor,
  storeTerms,
  transferPrice,
  type DeliveryMethod,
} from "@/lib/store-terms";
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

/** Subtotal, entrega y total: se usa en el resumen lateral y, en celular, arriba del botón. */
function Totals({ subtotal, shipping, delivery }: { subtotal: number; shipping: number; delivery: DeliveryMethod }) {
  return (
    <div className="flex flex-col gap-2 text-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="text-zinc-600">Productos</span>
        <span className="font-medium text-zinc-900">{formatMoney(subtotal)}</span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-zinc-600">{delivery === "pickup" ? "Retiro en el local" : "Envío"}</span>
        <span className="font-medium text-zinc-900">{shipping > 0 ? formatMoney(shipping) : "Sin cargo"}</span>
      </div>
      <div className="mt-1 flex items-baseline justify-between gap-3 border-t border-zinc-200 pt-3">
        <span className="text-zinc-600">Total</span>
        <span className="text-xl font-bold text-zinc-950">{formatMoney(subtotal + shipping)}</span>
      </div>
      {storeTerms.transferDiscountPercent > 0 ? (
        <p className="text-right text-xs text-zinc-500">
          o {formatMoney(transferPrice(subtotal) + shipping)} pagando por transferencia
        </p>
      ) : null}
    </div>
  );
}

export default function CheckoutPage() {
  const { items, ready, totalCents, totalQuantity, clear, syncStock } = useCart();
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [delivery, setDelivery] = useState<DeliveryMethod>("shipping");
  const shippingFee = shippingCostFor(totalCents);
  const shipping = delivery === "shipping" ? shippingFee : 0;

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
              if (delivery === "shipping" && !address) {
                setStatus({ state: "error", message: "Completá la dirección de envío o elegí retiro en el local." });
                return;
              }
              const deliveryLabel = deliveryLabels[delivery];
              const deliveryAddress = delivery === "shipping" ? address : "";
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
                    // El pedido guarda la entrega junto a la dirección para que se vea en el panel.
                    customer: {
                      customerName,
                      email,
                      phone,
                      address: deliveryAddress ? `${deliveryLabel}: ${deliveryAddress}` : deliveryLabel,
                    },
                    items: payloadItems,
                  }),
                });

                const data = (await res.json().catch(() => ({}))) as {
                  orderId?: string;
                  error?: string;
                  productId?: string;
                  available?: number;
                };
                if (!res.ok || !data.orderId) {
                  // Si el problema fue el stock, el carrito pasa a mostrar cuántas unidades quedan.
                  if (data.productId && typeof data.available === "number") syncStock(data.productId, data.available);
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
                  customer: { customerName, email, phone, address: deliveryAddress },
                  delivery: { label: deliveryLabel, cost: shipping },
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
              <fieldset className="flex flex-col gap-2 sm:col-span-2">
                <legend className="mb-1.5 text-sm font-medium text-zinc-800">Entrega</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {(["shipping", "pickup"] as const).map((method) => (
                    <label
                      key={method}
                      className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 ${
                        delivery === method
                          ? "border-amber-400 bg-amber-50 ring-2 ring-amber-200"
                          : "border-zinc-200 bg-white hover:border-zinc-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        value={method}
                        checked={delivery === method}
                        onChange={() => setDelivery(method)}
                        className="mt-0.5 h-5 w-5 shrink-0 accent-zinc-900"
                      />
                      <span className="flex flex-col">
                        <span className="text-sm font-semibold text-zinc-900">{deliveryLabels[method]}</span>
                        <span className="text-xs leading-5 text-zinc-600">
                          {method === "shipping"
                            ? `${shippingFee > 0 ? formatMoney(shippingFee) : "Gratis"} · llega en ${storeTerms.shippingTime}`
                            : "Sin cargo · coordinamos día y horario por WhatsApp"}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              {delivery === "shipping" ? (
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label htmlFor="checkout-address" className="text-sm font-medium text-zinc-800">
                    Dirección de envío
                  </label>
                  <input
                    id="checkout-address"
                    name="address"
                    autoComplete="street-address"
                    placeholder="Calle, número y localidad"
                    required
                    className={fieldClass}
                  />
                </div>
              ) : null}
            </div>

            {/* En celular el resumen queda abajo de todo: se repite el total arriba del botón. */}
            <div className="rounded-2xl bg-zinc-50 px-4 py-3 lg:hidden">
              <Totals subtotal={totalCents} shipping={shipping} delivery={delivery} />
            </div>

            {status.state === "error" ? (
              <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                {status.message}
              </div>
            ) : null}

            <p className="text-sm leading-6 text-zinc-600">
              <strong className="font-semibold text-zinc-900">No pagás ahora.</strong> Reservamos el stock y por WhatsApp
              coordinamos el pago y la entrega.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
              <button type="submit" disabled={status.state === "submitting"} className={primaryButton}>
                {status.state === "submitting" ? "Generando pedido..." : "Confirmar pedido por WhatsApp"}
              </button>
              <Link
                href="/cart"
                className="inline-flex min-h-11 items-center justify-center text-sm text-zinc-600 hover:text-amber-600 hover:underline underline-offset-4"
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
          <div className="mt-4 border-t border-zinc-200 pt-4 max-lg:hidden">
            <Totals subtotal={totalCents} shipping={shipping} delivery={delivery} />
          </div>
          <p className="mt-3 text-xs leading-5 text-zinc-500">
            Pagás después, por transferencia o con tarjeta
            {storeTerms.installments > 1 ? ` en hasta ${storeTerms.installments} cuotas sin interés` : ""}. Todos los
            productos tienen {storeTerms.warrantyMonths} meses de garantía.
          </p>
        </div>
      </div>
    </div>
  );
}
