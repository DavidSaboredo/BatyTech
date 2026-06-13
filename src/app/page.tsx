import Link from "next/link";
import { Carousel } from "@/components/Carousel";
import { ProductCard } from "@/components/ProductCard";
import { performanceTierOptions } from "@/lib/performance-tier";
import { getHomeStorefrontData } from "@/lib/storefront-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { categories, featured, usingFallback } = await getHomeStorefrontData();

  const slides = featured.slice(0, 4).map((p) => ({
    title: p.name,
    subtitle: "Ver producto",
    href: `/products/${p.slug}`,
    imageUrl: p.images[0]?.url || "/window.svg",
  }));

  const cards = featured.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    priceCents: p.priceCents,
    stock: p.stock,
    imageUrl: p.images[0]?.url || "/window.svg",
    performanceTier: p.performanceTier,
  }));

  return (
    <div className="flex flex-col gap-12">
      {usingFallback ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Modo local activo: se muestra un catálogo de ejemplo porque la base de datos no está conectada.
        </div>
      ) : null}

      <section className="relative grid items-stretch gap-8 overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.04] p-3 shadow-[0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-[2px] lg:grid-cols-[1.05fr_1fr]">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02)_45%,rgba(0,0,0,0)_70%)]" />
        <div className="surface-card relative z-10 flex flex-col justify-center gap-6 overflow-hidden rounded-3xl p-6 shadow-[0_18px_40px_rgba(15,23,42,0.16)] sm:p-8">
          <div className="absolute inset-y-0 left-0 w-1.5 bg-amber-400" />
          <div className="inline-flex w-fit rounded-full bg-zinc-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
            Tienda online de hardware
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="section-heading text-3xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
              Componentes de PC para armar tu setup en BatysTech
            </h1>
            <p className="max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
              Procesadores, GPUs, motherboards, memorias, almacenamiento y mas. Compra rapido, facil y con stock real.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              Stock real
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-950" />
              Catalogo administrable
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              Pedido rapido por WhatsApp
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/products"
              className="rounded-full border border-amber-400 bg-amber-400 px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-amber-300"
            >
              Ver productos
            </Link>
            <Link
              href="/cart"
              className="rounded-full border border-zinc-900 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-900 hover:text-white"
            >
              Ver carrito
            </Link>
          </div>
        </div>
        <div className="relative z-10 h-full">
          <Carousel slides={slides} />
        </div>
      </section>

      <section className="metallic-bg relative grid gap-6 overflow-hidden rounded-[32px] border border-white/10 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-5 lg:grid-cols-[250px_minmax(0,1fr)] lg:items-start lg:p-6">
        <div className="absolute inset-x-12 top-0 h-24 bg-gradient-to-b from-white/10 to-transparent blur-2xl" />
        <div className="absolute inset-y-8 left-0 w-px bg-gradient-to-b from-transparent via-amber-300/35 to-transparent" />
        <div className="absolute inset-y-8 right-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
        <aside className="surface-card relative z-10 self-start rounded-3xl p-5 shadow-[0_18px_40px_rgba(0,0,0,0.28)] lg:sticky lg:top-4">
          <div className="flex flex-col gap-1">
            <div className="inline-flex w-fit rounded-full bg-zinc-950 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">
              Explorar
            </div>
            <h2 className="section-heading text-2xl font-semibold text-zinc-950">Catálogo</h2>
            <p className="muted-copy text-sm">Accesos directos para encontrar productos más rápido.</p>
          </div>

          <div className="mt-6 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-500">Categorías</h3>
                <Link href="/products" className="text-sm text-zinc-600 hover:text-amber-600 hover:underline underline-offset-4">
                  Ver todo
                </Link>
              </div>
              <div className="flex flex-col gap-2">
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/products?category=${c.slug}`}
                    className="rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-800 hover:border-amber-300 hover:bg-amber-50"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-zinc-200 pt-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-500">Gamas de PC</h3>
              <div className="flex flex-col gap-2">
                {performanceTierOptions.map((option) => (
                  <Link
                    key={option.value}
                    href={`/products?tier=${option.value}`}
                    className="rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-800 hover:border-amber-400 hover:bg-amber-50 hover:text-zinc-950"
                  >
                    Gama {option.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="section-heading text-2xl font-semibold text-white">Productos Destacados</h2>
              <p className="text-sm text-zinc-300">Una vista más limpia para que el cliente se enfoque en los productos.</p>
            </div>
            <Link href="/products" className="text-sm text-zinc-300 hover:text-amber-300 hover:underline underline-offset-4">
              Ver más
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
