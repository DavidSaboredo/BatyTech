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
      <div className="rounded-2xl border bg-white p-5">
        <div className="text-sm text-zinc-600">Productos</div>
        <div className="mt-1 text-2xl font-semibold">{products}</div>
        <Link href={ownerAdminPath("products")} className="mt-3 inline-flex text-sm text-zinc-600 hover:underline">
          Gestionar
        </Link>
      </div>
      <div className="rounded-2xl border bg-white p-5">
        <div className="text-sm text-zinc-600">Categorías</div>
        <div className="mt-1 text-2xl font-semibold">{categories}</div>
        <Link href={ownerAdminPath("categories")} className="mt-3 inline-flex text-sm text-zinc-600 hover:underline">
          Gestionar
        </Link>
      </div>
      <div className="rounded-2xl border bg-white p-5">
        <div className="text-sm text-zinc-600">Órdenes pendientes</div>
        <div className="mt-1 text-2xl font-semibold">{ordersPending}</div>
        <Link href={ownerAdminPath("orders")} className="mt-3 inline-flex text-sm text-zinc-600 hover:underline">
          Ver órdenes
        </Link>
      </div>
    </div>
  );
}
