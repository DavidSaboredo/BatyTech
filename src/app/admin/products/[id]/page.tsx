import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { ownerAdminPath, requireAdmin } from "@/lib/admin";
import { slugify } from "@/lib/slug";
import { ImageUpload } from "@/components/ImageUpload";

export const dynamic = "force-dynamic";

function toInt(value: FormDataEntryValue | null, fallback: number) {
  const n = Math.floor(Number(value));
  return Number.isFinite(n) ? n : fallback;
}

async function updateProductAction(formData: FormData) {
  "use server";
  await requireAdmin();
  const id = String(formData.get("id") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const sku = String(formData.get("sku") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const priceCents = toInt(formData.get("priceCents"), 0);
  const stock = toInt(formData.get("stock"), 0);
  const categoryId = String(formData.get("categoryId") || "").trim();
  const brandId = String(formData.get("brandId") || "").trim();
  const imageUrl = String(formData.get("imageUrl") || "").trim() || "/window.svg";
  const featured = formData.get("featured") === "on";
  const isActive = formData.get("isActive") === "on";

  if (!id || !name || !sku || !description || !categoryId || !brandId) return;
  const slug = slugify(name);
  if (!slug) return;

  await prisma.product.update({
    where: { id },
    data: {
      name,
      slug,
      sku,
      description,
      priceCents,
      stock,
      categoryId,
      brandId,
      featured,
      isActive,
      images: {
        deleteMany: {},
        create: [{ url: imageUrl, alt: name, sortOrder: 0 }],
      },
    },
  });

  redirect(ownerAdminPath(`products/${id}`));
}

async function deleteProductAction(formData: FormData) {
  "use server";
  await requireAdmin();
  const id = String(formData.get("id") || "").trim();
  if (!id) return;
  await prisma.product.delete({ where: { id } }).catch(() => null);
  redirect(ownerAdminPath("products"));
}

export default async function AdminEditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const p = await params;
  const [product, categories, brands] = await Promise.all([
    prisma.product.findUnique({ where: { id: p.id }, include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Editar producto</h1>
          <div className="text-sm text-zinc-600">{product.id}</div>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/products/${product.slug}`} className="rounded-full border px-4 py-2 text-sm font-medium hover:bg-zinc-50">
            Ver en tienda
          </Link>
          <Link href={ownerAdminPath("products")} className="text-sm text-zinc-600 hover:underline">
            Volver
          </Link>
        </div>
      </div>

      <form action={updateProductAction} className="grid gap-4 rounded-2xl border bg-white p-5">
        <input type="hidden" name="id" value={product.id} />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Nombre</label>
            <input name="name" required defaultValue={product.name} className="h-10 rounded-xl border px-3 text-sm" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">SKU</label>
            <input name="sku" required defaultValue={product.sku} className="h-10 rounded-xl border px-3 text-sm" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Precio (centavos ARS)</label>
            <input
              name="priceCents"
              type="number"
              min={0}
              required
              defaultValue={product.priceCents}
              className="h-10 rounded-xl border px-3 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Stock</label>
            <input
              name="stock"
              type="number"
              min={0}
              required
              defaultValue={product.stock}
              className="h-10 rounded-xl border px-3 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Categoría</label>
            <select name="categoryId" required defaultValue={product.categoryId} className="h-10 rounded-xl border bg-white px-3 text-sm">
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Marca</label>
            <select name="brandId" required defaultValue={product.brandId} className="h-10 rounded-xl border bg-white px-3 text-sm">
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <ImageUpload name="imageUrl" defaultValue={product.images[0]?.url || "/window.svg"} label="Imagen" />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Descripción</label>
          <textarea name="description" required rows={6} defaultValue={product.description} className="rounded-xl border px-3 py-2 text-sm" />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input name="isActive" type="checkbox" defaultChecked={product.isActive} className="h-4 w-4" />
            Activo
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input name="featured" type="checkbox" defaultChecked={product.featured} className="h-4 w-4" />
            Destacado
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white">
            Guardar cambios
          </button>
          <button
            formAction={deleteProductAction}
            formNoValidate
            className="rounded-full border px-5 py-2 text-sm font-medium hover:bg-zinc-50"
          >
            Eliminar
          </button>
        </div>
      </form>
    </div>
  );
}
