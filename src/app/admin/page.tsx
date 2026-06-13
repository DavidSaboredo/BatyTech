import Link from "next/link";
import { prisma } from "@/lib/db";
import { ownerAdminPath } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const [products, categories, ordersPending] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
  ]);

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="surface-card rounded-3xl p-5">
        <div className="text-sm text-zinc-500">Productos</div>
        <div className="mt-2 text-3xl font-semibold text-zinc-950">{products}</div>
        <Link href={ownerAdminPath("products")} className="mt-4 inline-flex text-sm font-medium text-amber-700 hover:underline">
          Gestionar
        </Link>
      </div>
      <div className="surface-card rounded-3xl p-5">
        <div className="text-sm text-zinc-500">Categorías</div>
        <div className="mt-2 text-3xl font-semibold text-zinc-950">{categories}</div>
        <Link href={ownerAdminPath("categories")} className="mt-4 inline-flex text-sm font-medium text-amber-700 hover:underline">
          Gestionar
        </Link>
      </div>
      <div className="surface-card rounded-3xl p-5">
        <div className="text-sm text-zinc-500">Órdenes pendientes</div>
        <div className="mt-2 text-3xl font-semibold text-zinc-950">{ordersPending}</div>
        <Link href={ownerAdminPath("orders")} className="mt-4 inline-flex text-sm font-medium text-amber-700 hover:underline">
          Ver órdenes
        </Link>
      </div>
    </div>
  );
}
