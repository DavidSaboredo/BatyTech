import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { ownerAdminPath, requireAdmin } from "@/lib/admin";
import { slugify } from "@/lib/slug";
import { ImageUpload } from "@/components/ImageUpload";

export const dynamic = "force-dynamic";

function toInt(value: FormDataEntryValue | null, fallback: number) {
  const n = Math.floor(Number(value));
  return Number.isFinite(n) ? n : fallback;
}

async function createProductAction(formData: FormData) {
  "use server";
  await requireAdmin();
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

  if (!name || !sku || !description || !categoryId || !brandId) return;
  const slug = slugify(name);
  if (!slug) return;

  const product = await prisma.product.upsert({
    where: { sku },
    update: {
      name,
      slug,
      description,
      priceCents,
      stock,
      categoryId,
      brandId,
      featured,
      isActive,
    },
    create: {
      name,
      slug,
      description,
      sku,
      priceCents,
      stock,
      categoryId,
      brandId,
      featured,
      isActive,
    },
    select: { id: true },
  });

  await prisma.productImage.deleteMany({ where: { productId: product.id } });
  await prisma.productImage.create({
    data: { productId: product.id, url: imageUrl, alt: name, sortOrder: 0 },
  });

  redirect(ownerAdminPath(`products/${product.id}`));
}

export default async function AdminNewProductPage() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="section-heading text-2xl font-semibold text-zinc-950">Nuevo producto</h1>
        <Link href={ownerAdminPath("products")} className="text-sm font-medium text-zinc-600 hover:underline">
          Volver
        </Link>
      </div>

      <form action={createProductAction} className="surface-card grid gap-4 rounded-3xl p-5 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Nombre</label>
            <input name="name" required className="h-11 rounded-xl border px-3 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">SKU</label>
            <input name="sku" required className="h-11 rounded-xl border px-3 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Precio (centavos ARS)</label>
            <input name="priceCents" type="number" min={0} required className="h-11 rounded-xl border px-3 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Stock</label>
            <input name="stock" type="number" min={0} required className="h-11 rounded-xl border px-3 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Categoría</label>
            <select name="categoryId" required className="h-11 rounded-xl border bg-white px-3 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200">
              <option value="" />
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Marca</label>
            <select name="brandId" required className="h-11 rounded-xl border bg-white px-3 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200">
              <option value="" />
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <ImageUpload name="imageUrl" defaultValue="/window.svg" label="Imagen" />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Descripción</label>
          <textarea
            name="description"
            required
            rows={5}
            className="rounded-xl border px-3 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input name="isActive" type="checkbox" defaultChecked className="h-4 w-4" />
            Activo
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input name="featured" type="checkbox" className="h-4 w-4" />
            Destacado
          </label>
        </div>

        <button
          type="submit"
          className="rounded-full border border-amber-400 bg-amber-400 px-5 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-amber-300"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}
