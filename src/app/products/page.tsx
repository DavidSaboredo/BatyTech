import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { performanceTierOptions } from "@/lib/performance-tier";
import { getCatalogStorefrontData } from "@/lib/storefront-data";

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
  const tier = firstString(sp.tier);
  const q = firstString(sp.q)?.trim();

  const { categories, brands, products, usingFallback } = await getCatalogStorefrontData({
    category,
    brand,
    tier,
    q,
  });

  const cards = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    priceCents: p.priceCents,
    stock: p.stock,
    imageUrl: p.images[0]?.url || "/window.svg",
    performanceTier: p.performanceTier,
  }));

  return (
    <div className="flex flex-col gap-8">
      {usingFallback ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Catálogo de ejemplo visible en local mientras la base de datos no responde.
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <h1 className="section-heading text-3xl font-semibold text-zinc-950">Productos</h1>
        <p className="muted-copy max-w-2xl text-sm sm:text-base">Filtrá por categoría, marca o buscá por nombre o SKU para encontrar más rápido lo que necesitás.</p>
      </div>

      <form className="surface-card grid gap-3 rounded-3xl p-4 sm:grid-cols-5 sm:p-5">
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar (ej: RTX, Ryzen, NVMe, SKU...)"
          className="h-11 rounded-xl border border-zinc-200 px-3 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200 sm:col-span-2"
        />
        <select
          name="category"
          defaultValue={category || ""}
          className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
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
          className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
        >
          <option value="">Todas las marcas</option>
          {brands.map((b) => (
            <option key={b.id} value={b.slug}>
              {b.name}
            </option>
          ))}
        </select>
        <select
          name="tier"
          defaultValue={tier || ""}
          className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
        >
          <option value="">Todas las gamas</option>
          {performanceTierOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-2 sm:col-span-5">
          <button
            type="submit"
            className="rounded-full border border-zinc-900 bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:border-amber-400 hover:text-amber-300"
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
      {cards.length === 0 ? (
        <div className="surface-card rounded-3xl px-6 py-10 text-center">
          <h2 className="text-lg font-semibold text-zinc-900">No encontramos productos con esos filtros</h2>
          <p className="muted-copy mt-2 text-sm">Probá limpiar la búsqueda o elegir otra categoría o marca.</p>
        </div>
      ) : null}
    </div>
  );
}
