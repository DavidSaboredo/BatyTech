import Link from "next/link";
import { GeekCatSticker } from "@/components/GeekCatSticker";
import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

function firstString(v: string | string[] | undefined) {
  if (!v) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const category = firstString(sp.category);
  const brand = firstString(sp.brand);
  const q = firstString(sp.q)?.trim();

  const [categories, brands, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: {
        isActive: true,
        ...(category ? { category: { slug: category } } : {}),
        ...(brand ? { brand: { slug: brand } } : {}),
        ...(q
          ? {
              OR: [
                { name: { contains: q } },
                { description: { contains: q } },
                { sku: { contains: q } },
              ],
            }
          : {}),
      },
      include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
      orderBy: { updatedAt: "desc" },
      take: 60,
    }),
  ]);

  const cards = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    priceCents: p.priceCents,
    stock: p.stock,
    imageUrl: p.images[0]?.url || "/window.svg",
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">Productos</h1>
          <div className="pointer-events-none hidden opacity-70 sm:block">
            <GeekCatSticker name="workingHard" size={56} />
          </div>
        </div>
        <p className="text-sm text-zinc-600">Filtrá por categoría, marca o buscá por nombre/SKU.</p>
      </div>

      <form className="grid gap-3 rounded-2xl border border-amber-200 bg-white p-4 sm:grid-cols-4">
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar (ej: RTX, Ryzen, NVMe, SKU...)"
          className="h-10 rounded-xl border px-3 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200 sm:col-span-2"
        />
        <select
          name="category"
          defaultValue={category || ""}
          className="h-10 rounded-xl border bg-white px-3 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
        >
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          name="brand"
          defaultValue={brand || ""}
          className="h-10 rounded-xl border bg-white px-3 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
        >
          <option value="">Todas las marcas</option>
          {brands.map((b) => (
            <option key={b.id} value={b.slug}>
              {b.name}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-2 sm:col-span-4">
          <button
            type="submit"
            className="rounded-full border border-amber-400 bg-amber-400 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-amber-300"
          >
            Aplicar
          </button>
          <Link href="/products" className="text-sm text-zinc-600 hover:text-amber-600 hover:underline underline-offset-4">
            Limpiar
          </Link>
          <div className="ml-auto text-sm text-zinc-600">{cards.length} resultados</div>
        </div>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
