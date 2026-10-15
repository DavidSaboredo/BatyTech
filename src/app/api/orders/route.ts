import { prisma } from "@/lib/db";
import { isDatabaseUnavailableError } from "@/lib/database-errors";

type CreateOrderBody = {
  customer: {
    email: string;
    customerName: string;
    phone?: string;
    address?: string;
  };
  items: { productId: string; quantity: number }[];
};

/** Error de un producto puntual del pedido: lleva el producto para nombrarlo en el mensaje. */
class OrderItemError extends Error {
  constructor(
    readonly code: "invalid_product" | "insufficient_stock",
    readonly product?: { id: string; name: string; stock: number },
  ) {
    super(code);
  }
}

function isEmailLike(value: string) {
  return value.includes("@") && value.includes(".");
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as CreateOrderBody | null;
  const email = body?.customer?.email?.trim();
  const customerName = body?.customer?.customerName?.trim();
  const phone = body?.customer?.phone?.trim() || null;
  const address = body?.customer?.address?.trim() || null;
  const items = Array.isArray(body?.items) ? body.items : [];

  if (!email || !customerName || !isEmailLike(email) || items.length === 0) {
    return Response.json({ error: "Revisá tus datos: el nombre y un email válido son obligatorios." }, { status: 400 });
  }

  const normalizedItems = items
    .filter((x) => x && typeof x.productId === "string")
    .map((x) => ({ productId: x.productId, quantity: Math.floor(Number(x.quantity)) }))
    .filter((x) => x.productId && Number.isFinite(x.quantity) && x.quantity > 0 && x.quantity <= 999);

  if (normalizedItems.length === 0) {
    return Response.json({ error: "Tu carrito está vacío." }, { status: 400 });
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      const productIds = Array.from(new Set(normalizedItems.map((x) => x.productId)));
      // Se buscan también los inactivos para poder nombrar el producto en el error.
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true, priceCents: true, stock: true, isActive: true },
      });

      const productMap = new Map(products.map((p) => [p.id, p]));
      for (const item of normalizedItems) {
        const p = productMap.get(item.productId);
        if (!p || !p.isActive) throw new OrderItemError("invalid_product", p);
        if (p.stock < item.quantity) throw new OrderItemError("insufficient_stock", p);
      }

      for (const item of normalizedItems) {
        const updated = await tx.product.updateMany({
          where: { id: item.productId, isActive: true, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (updated.count !== 1) {
          // Otra compra se llevó unidades en el medio: se informa el stock que quedó.
          const fresh = await tx.product.findUnique({ where: { id: item.productId }, select: { stock: true } });
          const p = productMap.get(item.productId)!;
          throw new OrderItemError("insufficient_stock", { ...p, stock: fresh?.stock ?? 0 });
        }
      }

      const totalCents = normalizedItems.reduce((acc, item) => {
        const p = productMap.get(item.productId)!;
        return acc + p.priceCents * item.quantity;
      }, 0);

      return tx.order.create({
        data: {
          email,
          customerName,
          phone,
          address,
          totalCents,
          items: {
            create: normalizedItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPriceCents: productMap.get(item.productId)!.priceCents,
            })),
          },
        },
        select: { id: true },
      });
    });

    return Response.json({ orderId: order.id });
  } catch (err) {
    if (err instanceof OrderItemError && err.code === "invalid_product") {
      const error = err.product
        ? `${err.product.name} ya no está disponible. Quitalo del carrito para poder confirmar el pedido.`
        : "Uno de los productos ya no está disponible. Revisá tu carrito.";
      return Response.json({ error, productId: err.product?.id, available: 0 }, { status: 400 });
    }
    if (err instanceof OrderItemError && err.code === "insufficient_stock" && err.product) {
      const { id, name, stock } = err.product;
      const available = Math.max(0, stock);
      const error =
        available === 0
          ? `${name} se quedó sin stock. Quitalo del carrito para poder confirmar el pedido.`
          : `No hay stock suficiente de ${name}: ${
              available === 1 ? "queda 1 unidad" : `quedan ${available} unidades`
            }. Ajustá la cantidad en el carrito.`;
      return Response.json({ error, productId: id, available }, { status: 409 });
    }
    if (isDatabaseUnavailableError(err)) {
      return Response.json(
        { error: "No pudimos registrar el pedido en este momento. Probá de nuevo en unos minutos." },
        { status: 503 },
      );
    }
    return Response.json({ error: "No pudimos generar el pedido. Probá de nuevo en unos minutos." }, { status: 500 });
  }
}
