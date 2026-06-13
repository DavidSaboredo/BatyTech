import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

async function createCategoryAction(formData: FormData) {
  "use server";
  await requireAdmin();
  const name = String(formData.get("name") || "").trim();
  if (!name) return;
  const slug = slugify(name);
  if (!slug) return;
  await prisma.category.upsert({
    where: { slug },
    update: { name },
    create: { name, slug },
  });
  revalidatePath("/admin/categories");
}

async function updateCategoryAction(formData: FormData) {
  "use server";
  await requireAdmin();
  const id = String(formData.get("id") || "").trim();
  const name = String(formData.get("name") || "").trim();
  if (!id || !name) return;
  const slug = slugify(name);
  if (!slug) return;
  await prisma.category.update({
    where: { id },
    data: { name, slug },
  });
  revalidatePath("/admin/categories");
}

async function deleteCategoryAction(formData: FormData) {
  "use server";
  await requireAdmin();
  const id = String(formData.get("id") || "").trim();
  if (!id) return;
  await prisma.category.delete({ where: { id } }).catch(() => null);
  revalidatePath("/admin/categories");
}

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="surface-card rounded-3xl p-5">
        <div className="text-sm font-semibold text-zinc-900">Nueva categoría</div>
        <form action={createCategoryAction} className="mt-3 flex flex-wrap gap-2">
          <input
            name="name"
            placeholder="Ej: Procesadores"
            className="h-11 flex-1 rounded-xl border px-3 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
          />
          <button type="submit" className="h-11 rounded-full border border-amber-400 bg-amber-400 px-5 text-sm font-semibold text-zinc-900 hover:bg-amber-300">
            Crear/Actualizar
          </button>
        </form>
      </div>

      <div className="surface-card overflow-hidden rounded-3xl">
        <div className="border-b border-amber-100 px-5 py-3 text-sm font-semibold text-zinc-900">Categorías</div>
        <div className="divide-y">
          {categories.map((c) => (
            <form key={c.id} action={updateCategoryAction} className="flex flex-wrap items-center gap-3 px-5 py-3">
              <input type="hidden" name="id" value={c.id} />
              <div className="min-w-0 flex-1">
                <input
                  name="name"
                  defaultValue={c.name}
                  className="h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm font-medium text-zinc-900 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                />
                <div className="mt-1 text-xs text-zinc-600">
                  slug: {c.slug} · productos: {c._count.products}
                </div>
              </div>
              <button
                type="submit"
                className="rounded-full border border-zinc-900 bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:border-amber-400 hover:text-amber-300"
              >
                Guardar
              </button>
              <button
                type="submit"
                formAction={deleteCategoryAction}
                className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium hover:bg-zinc-50"
              >
                Eliminar
              </button>
            </form>
          ))}
          {categories.length === 0 ? (
            <div className="px-5 py-6 text-sm text-zinc-600">No hay categorías todavía.</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
