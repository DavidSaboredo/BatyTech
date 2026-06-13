import Link from "next/link";
import { Carousel } from "@/components/Carousel";
import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/db";
import { performanceTierOptions } from "@/lib/performance-tier";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [categories, featured] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: { featured: true, isActive: true },
      include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
      orderBy: { updatedAt: "desc" },
      take: 8,
    }),
  ]);

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
      <section className="grid items-stretch gap-8 lg:grid-cols-[1.05fr_1fr]">
        <div className="surface-card relative flex flex-col justify-center gap-6 overflow-hidden rounded-3xl p-6 sm:p-8">
          <div className="absolute inset-y-0 left-0 w-1.5 bg-amber-400" />
          <div className="inline-flex w-fit rounded-full bg-zinc-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
            Tienda online de hardware
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="section-heading text-3xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
              Componentes de PC para armar tu setup en BatyTech
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
        <Carousel slides={slides} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
        <aside className="flex flex-col gap-5 lg:sticky lg:top-24">
          <div className="surface-card rounded-3xl p-5">
            <div className="flex items-end justify-between gap-3">
              <div className="flex flex-col gap-1">
                <h2 className="section-heading text-2xl font-semibold text-zinc-950">Categorías</h2>
                <p className="muted-copy text-sm">Entrá directo a lo que buscás.</p>
              </div>
              <Link href="/products" className="text-sm text-zinc-600 hover:text-amber-600 hover:underline underline-offset-4">
                Ver todo
              </Link>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/products?category=${c.slug}`}
                  className="rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm font-medium text-zinc-800 shadow-sm hover:border-amber-300 hover:bg-amber-50"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="surface-card rounded-3xl p-5">
            <div className="flex flex-col gap-1">
              <h2 className="section-heading text-2xl font-semibold text-zinc-950">Gamas de PC</h2>
              <p className="muted-copy text-sm">Filtrá rapido por nivel de rendimiento.</p>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              {performanceTierOptions.map((option) => (
                <Link
                  key={option.value}
                  href={`/products?tier=${option.value}`}
                  className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-800 shadow-sm hover:border-amber-400 hover:bg-amber-50 hover:text-zinc-950"
                >
                  Gama {option.label}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex flex-col gap-4">
          <div className="flex items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="section-heading text-2xl font-semibold text-zinc-950">Destacados</h2>
              <p className="muted-copy text-sm">Productos elegidos para mostrar lo mejor de la tienda.</p>
            </div>
            <Link href="/products" className="text-sm text-zinc-600 hover:text-amber-600 hover:underline underline-offset-4">
              Ver más
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
