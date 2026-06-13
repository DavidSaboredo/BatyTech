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
    <div className="flex flex-col gap-10">
      <section className="grid gap-8 lg:grid-cols-2">
        <div className="flex flex-col justify-center gap-4">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Componentes de PC para armar tu setup en BatyTech
          </h1>
          <p className="text-zinc-600">
            Procesadores, GPUs, motherboards, memorias, almacenamiento y más. Comprá rápido, fácil y con stock real.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/products"
              className="rounded-full border border-amber-400 bg-amber-400 px-5 py-2 text-sm font-semibold text-zinc-900 hover:bg-amber-300"
            >
              Ver productos
            </Link>
            <Link
              href="/cart"
              className="rounded-full border border-zinc-900 bg-white px-5 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-900 hover:text-white"
            >
              Ver carrito
            </Link>
          </div>
        </div>
        <Carousel slides={slides} />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl font-semibold">Categorías</h2>
          <Link href="/products" className="text-sm text-zinc-600 hover:text-amber-600 hover:underline underline-offset-4">
            Ver todo
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/products?category=${c.slug}`}
              className="rounded-full border border-amber-200 bg-white px-3 py-1.5 text-sm hover:border-amber-300 hover:bg-amber-50"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl font-semibold">Destacados</h2>
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
