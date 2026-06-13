import Link from "next/link";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { ownerAdminPath, requireAdmin } from "@/lib/admin";
import { AdminDatabaseUnavailable } from "@/components/AdminDatabaseUnavailable";
import { isDatabaseUnavailableError } from "@/lib/database-errors";
import { getPerformanceTierLabel } from "@/lib/performance-tier";
import { formatMoney } from "@/lib/money";

export const dynamic = "force-dynamic";

async function deleteProductAction(formData: FormData) {
  "use server";
  await requireAdmin();
  const id = String(formData.get("id") || "").trim();
  if (!id) return;
  await prisma.product.delete({ where: { id } }).catch(() => null);
  revalidatePath("/admin/products");
}

export default async function AdminProductsPage() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true, brand: true },
      orderBy: { updatedAt: "desc" },
      take: 200,
    });

    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="section-heading text-2xl font-semibold text-zinc-950">Productos</h1>
            <div className="text-sm text-zinc-600">{products.length} items</div>
          </div>
          <Link
            href={ownerAdminPath("products/new")}
            className="rounded-full border border-amber-400 bg-amber-400 px-5 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-amber-300"
          >
            Nuevo producto
          </Link>
        </div>

        <div className="grid gap-3 lg:hidden">
          {products.map((p) => (
            <div key={p.id} className="surface-card rounded-3xl p-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-zinc-900">{p.name}</div>
                    <div className="mt-1 text-xs text-zinc-600">
                      {p.sku} · {p.isActive ? "Activo" : "Inactivo"} · {p.featured ? "Destacado" : "Normal"}
                      {p.performanceTier ? ` · Gama ${getPerformanceTierLabel(p.performanceTier)}` : ""}
                    </div>
                  </div>
                  <div className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-800">{p.stock} stock</div>
                </div>
                <div className="grid gap-2 text-sm text-zinc-700 sm:grid-cols-3">
                  <div>
                    <div className="text-[11px] uppercase tracking-wide text-zinc-400">Categoría</div>
                    <div>{p.category.name}</div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wide text-zinc-400">Marca</div>
                    <div>{p.brand.name}</div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wide text-zinc-400">Precio</div>
                    <div className="font-medium text-zinc-900">{formatMoney(p.priceCents)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <Link href={ownerAdminPath(`products/${p.id}`)} className="font-medium text-amber-700 hover:underline">
                    Editar
                  </Link>
                  <form action={deleteProductAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className="font-medium text-zinc-600 hover:underline">
                      Eliminar
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 ? <div className="surface-card rounded-3xl px-5 py-6 text-sm text-zinc-600">No hay productos todavía.</div> : null}
        </div>

        <div className="surface-card hidden overflow-hidden rounded-3xl lg:block">
          <div className="grid grid-cols-[minmax(0,2.4fr)_minmax(0,1.1fr)_minmax(0,1.1fr)_minmax(0,1fr)_90px_120px] gap-3 border-b border-amber-100 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            <div>Producto</div>
            <div>Categoría</div>
            <div>Marca</div>
            <div>Precio</div>
            <div className="text-right">Stock</div>
            <div className="text-right">Acciones</div>
          </div>
          <div className="divide-y">
            {products.map((p) => (
              <div key={p.id} className="grid grid-cols-[minmax(0,2.4fr)_minmax(0,1.1fr)_minmax(0,1.1fr)_minmax(0,1fr)_90px_120px] gap-3 px-5 py-3 text-sm">
                <div className="min-w-0">
                  <div className="font-semibold text-zinc-900">{p.name}</div>
                  <div className="text-xs text-zinc-600">
                    {p.sku} · {p.isActive ? "Activo" : "Inactivo"} · {p.featured ? "Destacado" : "Normal"}
                    {p.performanceTier ? ` · Gama ${getPerformanceTierLabel(p.performanceTier)}` : ""}
                  </div>
                </div>
                <div className="text-zinc-700">{p.category.name}</div>
                <div className="text-zinc-700">{p.brand.name}</div>
                <div>{formatMoney(p.priceCents)}</div>
                <div className="text-right font-medium">{p.stock}</div>
                <div className="flex justify-end gap-2 whitespace-nowrap">
                  <Link href={ownerAdminPath(`products/${p.id}`)} className="text-sm font-medium text-amber-700 hover:underline">
                    Editar
                  </Link>
                  <form action={deleteProductAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className="text-sm font-medium text-zinc-600 hover:underline">
                      Eliminar
                    </button>
                  </form>
                </div>
              </div>
            ))}
            {products.length === 0 ? <div className="px-5 py-6 text-sm text-zinc-600">No hay productos todavía.</div> : null}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) throw error;
    return <AdminDatabaseUnavailable scope="la gestión de productos" />;
  }
}
