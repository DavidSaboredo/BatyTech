import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

async function createBrandAction(formData: FormData) {
  "use server";
  await requireAdmin();
  const name = String(formData.get("name") || "").trim();
  if (!name) return;
  const slug = slugify(name);
  if (!slug) return;
  await prisma.brand.upsert({
    where: { slug },
    update: { name },
    create: { name, slug },
  });
  revalidatePath("/admin/brands");
}

async function deleteBrandAction(formData: FormData) {
  "use server";
  await requireAdmin();
  const id = String(formData.get("id") || "").trim();
  if (!id) return;
  await prisma.brand.delete({ where: { id } }).catch(() => null);
  revalidatePath("/admin/brands");
}

export default async function AdminBrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border bg-white p-5">
        <div className="text-sm font-semibold">Nueva marca</div>
        <form action={createBrandAction} className="mt-3 flex flex-wrap gap-2">
          <input name="name" placeholder="Ej: ASUS" className="h-10 flex-1 rounded-xl border px-3 text-sm" />
          <button type="submit" className="h-10 rounded-full bg-zinc-900 px-5 text-sm font-medium text-white">
            Crear/Actualizar
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white">
        <div className="border-b px-5 py-3 text-sm font-semibold">Marcas</div>
        <div className="divide-y">
          {brands.map((b) => (
            <div key={b.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3">
              <div className="flex flex-col">
                <div className="font-medium">{b.name}</div>
                <div className="text-xs text-zinc-600">
                  slug: {b.slug} · productos: {b._count.products}
                </div>
              </div>
              <form action={deleteBrandAction}>
                <input type="hidden" name="id" value={b.id} />
                <button type="submit" className="rounded-full border px-3 py-1.5 text-sm hover:bg-zinc-50">
                  Eliminar
                </button>
              </form>
            </div>
          ))}
          {brands.length === 0 ? <div className="px-5 py-6 text-sm text-zinc-600">No hay marcas todavía.</div> : null}
        </div>
      </div>
    </div>
  );
}
