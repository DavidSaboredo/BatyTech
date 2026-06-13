import { prisma } from "@/lib/db";

type CreateOrderBody = {
  customer: {
    email: string;
    customerName: string;
    phone?: string;
    address?: string;
  };
  items: { productId: string; quantity: number }[];
};

function isEmailLike(value: string) {
  return value.includes("@") && value.includes(".");
}

export async function POST(req: Request) {
  const body = (await req.json()) as CreateOrderBody;
  const email = body?.customer?.email?.trim();
  const customerName = body?.customer?.customerName?.trim();
  const phone = body?.customer?.phone?.trim() || null;
  const address = body?.customer?.address?.trim() || null;
  const items = Array.isArray(body?.items) ? body.items : [];

  if (!email || !customerName || !isEmailLike(email) || items.length === 0) {
    return Response.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const normalizedItems = items
    .filter((x) => x && typeof x.productId === "string")
    .map((x) => ({ productId: x.productId, quantity: Math.floor(Number(x.quantity)) }))
    .filter((x) => x.productId && Number.isFinite(x.quantity) && x.quantity > 0 && x.quantity <= 999);

  if (normalizedItems.length === 0) {
    return Response.json({ error: "Carrito vacío" }, { status: 400 });
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      const productIds = Array.from(new Set(normalizedItems.map((x) => x.productId)));
      const products = await tx.product.findMany({
        where: { id: { in: productIds }, isActive: true },
        select: { id: true, priceCents: true, stock: true },
      });

      const productMap = new Map(products.map((p) => [p.id, p]));
      for (const item of normalizedItems) {
        const p = productMap.get(item.productId);
        if (!p) throw new Error("invalid_product");
        if (p.stock < item.quantity) throw new Error("insufficient_stock");
      }

      for (const item of normalizedItems) {
        const updated = await tx.product.updateMany({
          where: { id: item.productId, isActive: true, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (updated.count !== 1) throw new Error("insufficient_stock");
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
    if (err instanceof Error && err.message === "invalid_product") {
      return Response.json({ error: "Producto inválido" }, { status: 400 });
    }
    if (err instanceof Error && err.message === "insufficient_stock") {
      return Response.json({ error: "Stock insuficiente" }, { status: 409 });
    }
    return Response.json({ error: "Error creando la orden" }, { status: 500 });
  }
}
