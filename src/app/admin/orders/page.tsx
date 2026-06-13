import Link from "next/link";
import { prisma } from "@/lib/db";
import { ownerAdminPath } from "@/lib/admin";
import { formatMoney } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="section-heading text-2xl font-semibold text-zinc-950">Órdenes</h1>
        <div className="text-sm text-zinc-600">{orders.length} últimas órdenes</div>
      </div>

      <div className="surface-card overflow-hidden rounded-3xl">
        <div className="grid grid-cols-12 gap-2 border-b border-amber-100 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          <div className="col-span-4">Orden</div>
          <div className="col-span-3">Cliente</div>
          <div className="col-span-2">Estado</div>
          <div className="col-span-2">Total</div>
          <div className="col-span-1 text-right">Ver</div>
        </div>
        <div className="divide-y">
          {orders.map((o) => (
            <div key={o.id} className="grid grid-cols-12 gap-2 px-5 py-3 text-sm">
              <div className="col-span-4">
                <div className="font-semibold text-zinc-900">{o.id}</div>
                <div className="text-xs text-zinc-600">{o.createdAt.toLocaleString("es-AR")}</div>
              </div>
              <div className="col-span-3">
                <div className="font-semibold text-zinc-900">{o.customerName}</div>
                <div className="text-xs text-zinc-600">{o.email}</div>
              </div>
              <div className="col-span-2 font-medium">{o.status}</div>
              <div className="col-span-2 font-medium">{formatMoney(o.totalCents)}</div>
              <div className="col-span-1 flex justify-end">
                <Link href={ownerAdminPath(`orders/${o.id}`)} className="text-sm font-medium text-amber-700 hover:underline">
                  Ver
                </Link>
              </div>
            </div>
          ))}
          {orders.length === 0 ? <div className="px-5 py-6 text-sm text-zinc-600">No hay órdenes todavía.</div> : null}
        </div>
      </div>
    </div>
  );
}
