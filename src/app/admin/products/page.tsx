import Link from "next/link";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { ownerAdminPath, requireAdmin } from "@/lib/admin";
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
  const products = await prisma.product.findMany({
    include: { category: true, brand: true },
    orderBy: { updatedAt: "desc" },
    take: 200,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Productos</h1>
          <div className="text-sm text-zinc-600">{products.length} items</div>
        </div>
        <Link href={ownerAdminPath("products/new")} className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white">
          Nuevo producto
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white">
        <div className="grid grid-cols-12 gap-2 border-b px-5 py-3 text-xs font-semibold text-zinc-600">
          <div className="col-span-4">Producto</div>
          <div className="col-span-2">Categoría</div>
          <div className="col-span-2">Marca</div>
          <div className="col-span-2">Precio</div>
          <div className="col-span-1 text-right">Stock</div>
          <div className="col-span-1 text-right">Acciones</div>
        </div>
        <div className="divide-y">
          {products.map((p) => (
            <div key={p.id} className="grid grid-cols-12 gap-2 px-5 py-3 text-sm">
              <div className="col-span-4">
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-zinc-600">
                  {p.sku} · {p.isActive ? "Activo" : "Inactivo"} · {p.featured ? "Destacado" : "Normal"}
                </div>
              </div>
              <div className="col-span-2 text-zinc-700">{p.category.name}</div>
              <div className="col-span-2 text-zinc-700">{p.brand.name}</div>
              <div className="col-span-2">{formatMoney(p.priceCents)}</div>
              <div className="col-span-1 text-right">{p.stock}</div>
              <div className="col-span-1 flex justify-end gap-2">
                <Link href={ownerAdminPath(`products/${p.id}`)} className="text-sm text-zinc-600 hover:underline">
                  Editar
                </Link>
                <form action={deleteProductAction}>
                  <input type="hidden" name="id" value={p.id} />
                  <button type="submit" className="text-sm text-zinc-600 hover:underline">
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
}
