import Link from "next/link";
import { Carousel } from "@/components/Carousel";
import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/db";

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
  }));

  return (
    <div className="flex flex-col gap-12">
      <section className="grid items-stretch gap-8 lg:grid-cols-[1.05fr_1fr]">
        <div className="surface-card flex flex-col justify-center gap-6 rounded-3xl p-6 sm:p-8">
          <div className="inline-flex w-fit rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
            Tienda online de hardware
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="section-heading text-3xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
              Componentes de PC para armar tu setup en BatyTech
            </h1>
            <p className="muted-copy max-w-2xl text-base sm:text-lg">
              Procesadores, GPUs, motherboards, memorias, almacenamiento y mas. Compra rapido, facil y con stock real.
            </p>
          </div>
          <div className="grid gap-2 text-sm text-zinc-600 sm:grid-cols-3">
            <div className="rounded-2xl border border-amber-100 bg-white px-4 py-3">Stock actualizado</div>
            <div className="rounded-2xl border border-amber-100 bg-white px-4 py-3">Carga por admin</div>
            <div className="rounded-2xl border border-amber-100 bg-white px-4 py-3">Checkout por WhatsApp</div>
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

      <section className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="section-heading text-2xl font-semibold text-zinc-950">Categorías</h2>
            <p className="muted-copy text-sm">Entrá directo a la parte del catálogo que te interesa.</p>
          </div>
          <Link href="/products" className="text-sm text-zinc-600 hover:text-amber-600 hover:underline underline-offset-4">
            Ver todo
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/products?category=${c.slug}`}
              className="rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:border-amber-300 hover:bg-amber-50"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="section-heading text-2xl font-semibold text-zinc-950">Destacados</h2>
            <p className="muted-copy text-sm">Productos elegidos para mostrar lo mejor de la tienda.</p>
          </div>
          <Link href="/products" className="text-sm text-zinc-600 hover:text-amber-600 hover:underline underline-offset-4">
            Ver más
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
