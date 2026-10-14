import type { Metadata } from "next";
import Link from "next/link";
import { GeekCatSticker } from "@/components/GeekCatSticker";
import { ProductCard } from "@/components/ProductCard";
import { performanceTierOptions } from "@/lib/performance-tier";
import { productImageUrl } from "@/lib/product-image";
import { pageMetadata } from "@/lib/site";
import { getCatalogStorefrontData } from "@/lib/storefront-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Productos",
  description:
    "Catálogo de BatysTech: procesadores, placas de video, motherboards, memorias, almacenamiento, fuentes y PCs armadas. Filtrá por categoría, marca o gama.",
  path: "/products",
});

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
    imageUrl: productImageUrl(p.images[0]?.url),
    performanceTier: p.performanceTier,
  }));

  const activeCategory = categories.find((c) => c.slug === category);
  const activeBrand = brands.find((b) => b.slug === brand);
  const hasFilters = Boolean(category || brand || tier || q);
  const fieldClass =
    "h-11 w-full min-w-0 rounded-xl border border-zinc-200 bg-white px-3 text-base focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200";

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      {usingFallback ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Estás viendo productos de ejemplo porque la base de datos no está conectada (solo en desarrollo).
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <h1 className="section-heading text-2xl font-semibold text-amber-300 sm:text-3xl">
          {activeCategory?.name ?? activeBrand?.name ?? "Productos"}
        </h1>
        <p className="max-w-2xl text-sm text-amber-100/90 sm:text-base">
          Filtrá por categoría, marca o gama, o buscá por nombre o SKU para encontrar más rápido lo que necesitás.
        </p>
      </div>

      <form role="search" className="surface-card grid grid-cols-2 gap-2 rounded-3xl p-3 sm:grid-cols-5 sm:gap-3 sm:p-5">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Buscar (ej: RTX, Ryzen, NVMe, SKU...)"
          aria-label="Buscar productos"
          className={`${fieldClass} col-span-2`}
        />
        <select
          name="category"
          defaultValue={category || ""}
          aria-label="Categoría"
          className={fieldClass}
        >
          <option value="">Categoría</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          name="brand"
          defaultValue={brand || ""}
          aria-label="Marca"
          className={fieldClass}
        >
          <option value="">Marca</option>
          {brands.map((b) => (
            <option key={b.id} value={b.slug}>
              {b.name}
            </option>
          ))}
        </select>
        <select
          name="tier"
          defaultValue={tier || ""}
          aria-label="Gama"
          className={`${fieldClass} col-span-2 sm:col-span-1`}
        >
          <option value="">Gama</option>
          {performanceTierOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="col-span-2 flex flex-wrap items-center gap-3 sm:col-span-5">
          <button
            type="submit"
            className="min-h-10 rounded-full border border-zinc-900 bg-zinc-900 px-5 text-sm font-semibold text-white hover:border-amber-400 hover:text-amber-300"
          >
            Buscar
          </button>
          {hasFilters ? (
            <Link href="/products" className="text-sm text-zinc-600 hover:text-amber-600 hover:underline underline-offset-4">
              Limpiar filtros
            </Link>
          ) : null}
          <div className="ml-auto text-sm text-zinc-600">
            {cards.length} {cards.length === 1 ? "resultado" : "resultados"}
          </div>
        </div>
      </form>

      {cards.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {cards.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="surface-card flex flex-col items-center gap-3 rounded-3xl px-6 py-10 text-center">
          <GeekCatSticker name="thinking" size={110} />
          <h2 className="text-lg font-semibold text-zinc-900">
            {hasFilters ? "No encontramos productos con esos filtros" : "Todavía no hay productos cargados"}
          </h2>
          <p className="muted-copy max-w-md text-sm">
            {hasFilters
              ? "Probá con otra búsqueda o elegí otra categoría, marca o gama."
              : "Estamos cargando el catálogo. Volvé a pasar en un rato."}
          </p>
          {hasFilters ? (
            <Link
              href="/products"
              className="mt-1 inline-flex min-h-11 items-center rounded-full border border-zinc-900 bg-zinc-900 px-5 text-sm font-semibold text-white hover:text-amber-300"
            >
              Ver todos los productos
            </Link>
          ) : null}
        </div>
      )}
    </div>
  );
}
