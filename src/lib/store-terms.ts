/**
 * Condiciones de venta que se muestran en el detalle del producto, el carrito y el checkout.
 *
 * VALORES DE EJEMPLO: BatysTech es una tienda de demostración. Para una tienda real,
 * cambiá los números acá y se actualizan en todo el sitio.
 * Los montos van en pesos, igual que los precios de los productos.
 */
export const storeTerms = {
  /** Costo del envío a domicilio a todo el país. */
  shippingCost: 14_900,
  /** Desde este subtotal el envío es sin cargo. Poné 0 para que siempre se cobre. */
  freeShippingFrom: 1_500_000,
  shippingTime: "3 a 5 días hábiles",
  /** Cuotas sin interés con tarjeta de crédito. Poné 1 para no mostrarlas. */
  installments: 3,
  /** Descuento pagando por transferencia, en porcentaje. Poné 0 para no mostrarlo. */
  transferDiscountPercent: 10,
  warrantyMonths: 12,
} as const;

export type DeliveryMethod = "shipping" | "pickup";

export function shippingCostFor(subtotal: number) {
  const { shippingCost, freeShippingFrom } = storeTerms;
  return freeShippingFrom > 0 && subtotal >= freeShippingFrom ? 0 : shippingCost;
}

/** Precio con el descuento por transferencia (redondeado al peso). */
export function transferPrice(amount: number) {
  return Math.round((amount * (100 - storeTerms.transferDiscountPercent)) / 100);
}

/** Valor de cada cuota sin interés (redondeado hacia arriba para no mostrar menos de lo que se cobra). */
export function installmentAmount(amount: number) {
  return Math.ceil(amount / storeTerms.installments);
}

export const deliveryLabels: Record<DeliveryMethod, string> = {
  shipping: "Envío a domicilio",
  pickup: "Retiro en el local",
};
