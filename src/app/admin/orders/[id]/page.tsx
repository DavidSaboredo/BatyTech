import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { ownerAdminPath, requireAdmin } from "@/lib/admin";
import { formatMoney } from "@/lib/money";

export const dynamic = "force-dynamic";

const allowedStatuses = ["PENDING", "PAID", "SHIPPED", "CANCELLED"] as const;
type AllowedStatus = (typeof allowedStatuses)[number];
function isAllowedStatus(value: string): value is AllowedStatus {
  return (allowedStatuses as readonly string[]).includes(value);
}

async function updateStatusAction(formData: FormData) {
  "use server";
  await requireAdmin();
  const id = String(formData.get("id") || "").trim();
  const status = String(formData.get("status") || "").trim();
  if (!id || !status) return;

  if (!isAllowedStatus(status)) return;
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath(`/admin/orders/${id}`);
  redirect(ownerAdminPath(`orders/${id}`));
}

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const p = await params;
  const order = await prisma.order.findUnique({
    where: { id: p.id },
    include: {
      items: {
        include: { product: { select: { name: true, sku: true, slug: true } } },
      },
    },
  });

  if (!order) notFound();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Orden</h1>
          <div className="text-sm text-zinc-600">{order.id}</div>
        </div>
        <Link href={ownerAdminPath("orders")} className="text-sm text-zinc-600 hover:underline">
          Volver
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 lg:col-span-2">
          <div className="text-sm font-semibold">Items</div>
          <div className="mt-3 divide-y rounded-xl border">
            {order.items.map((it) => (
              <div key={it.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                <div className="flex flex-col">
                  <Link href={`/products/${it.product.slug}`} className="font-medium hover:underline">
                    {it.product.name}
                  </Link>
                  <div className="text-xs text-zinc-600">{it.product.sku}</div>
                </div>
                <div className="text-zinc-600">× {it.quantity}</div>
                <div className="font-medium">{formatMoney(it.unitPriceCents * it.quantity)}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t pt-4">
            <div className="text-sm text-zinc-600">Total</div>
            <div className="text-lg font-semibold">{formatMoney(order.totalCents)}</div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border bg-white p-5">
            <div className="text-sm font-semibold">Cliente</div>
            <div className="mt-3 text-sm">
              <div className="font-medium">{order.customerName}</div>
              <div className="text-zinc-600">{order.email}</div>
              {order.phone ? <div className="text-zinc-600">{order.phone}</div> : null}
              {order.address ? <div className="text-zinc-600">{order.address}</div> : null}
            </div>
            <div className="mt-3 text-xs text-zinc-600">{order.createdAt.toLocaleString("es-AR")}</div>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <div className="text-sm font-semibold">Estado</div>
            <form action={updateStatusAction} className="mt-3 flex flex-col gap-3">
              <input type="hidden" name="id" value={order.id} />
              <select name="status" defaultValue={order.status} className="h-10 rounded-xl border bg-white px-3 text-sm">
                <option value="PENDING">PENDING</option>
                <option value="PAID">PAID</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
              <button type="submit" className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white">
                Actualizar estado
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
