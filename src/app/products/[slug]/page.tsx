import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { getPerformanceTierLabel } from "@/lib/performance-tier";
import { formatMoney } from "@/lib/money";
import { getStorefrontProductBySlug } from "@/lib/storefront-data";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await params;
  const { product, usingFallback } = await getStorefrontProductBySlug(p.slug);

  if (!product || !product.isActive) notFound();

  const imageUrl = product.images[0]?.url || "/window.svg";
  const performanceTierLabel = getPerformanceTierLabel(product.performanceTier);
  const specs = product.specs?.split("\n").map((line) => line.trim()).filter(Boolean) ?? [];
  const fpsGames = product.fpsGames?.split("\n").map((line) => line.trim()).filter(Boolean) ?? [];

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        {usingFallback ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Vista local con producto de ejemplo porque la base de datos no está conectada.
          </div>
        ) : null}
        <div className="surface-card overflow-hidden rounded-3xl">
          <div className="relative h-80 w-full bg-zinc-50">
            <Image src={imageUrl} alt={product.name} fill className="object-contain p-10" priority />
          </div>
          {product.images.length > 1 ? (
            <div className="grid grid-cols-4 gap-2 border-t border-zinc-200 bg-white p-3">
              {product.images.slice(0, 4).map((img) => (
                <div key={img.id} className="relative h-16 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
                  <Image src={img.url} alt={img.alt} fill className="object-contain p-4" />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <Link
            href="/products"
            className="inline-flex rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:border-amber-400 hover:text-zinc-950"
          >
            Volver a productos
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-amber-100/85">
          <Link href="/products" className="hover:text-amber-300 hover:underline underline-offset-4">
            Productos
          </Link>
          <span>/</span>
          <Link
            href={`/products?category=${product.category.slug}`}
            className="hover:text-amber-300 hover:underline underline-offset-4"
          >
            {product.category.name}
          </Link>
          <span>/</span>
          <Link href={`/products?brand=${product.brand.slug}`} className="hover:text-amber-300 hover:underline underline-offset-4">
            {product.brand.name}
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          {performanceTierLabel ? (
            <div className="inline-flex w-fit rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
              Gama {performanceTierLabel}
            </div>
          ) : null}
          <h1 className="section-heading text-3xl font-semibold tracking-tight text-amber-300">{product.name}</h1>
          <div className="text-sm text-amber-100/75">SKU: {product.sku}</div>
          <div className="text-3xl font-semibold text-amber-200">{formatMoney(product.priceCents)}</div>
        </div>

        <div className="surface-card rounded-3xl p-5">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="flex flex-col gap-1">
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Disponibilidad</div>
              <div className={`text-sm font-medium ${product.stock > 0 ? "text-zinc-700" : "text-red-600"}`}>
                {product.stock > 0 ? `Stock: ${product.stock}` : "Sin stock"}
              </div>
            </div>
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                priceCents: product.priceCents,
                imageUrl,
                stock: product.stock,
              }}
              showQuantitySelector
            />
          </div>
        </div>

        <div className="surface-card rounded-3xl p-5">
          <div className="text-sm font-semibold text-zinc-900">Descripción</div>
          <div className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-700">{product.description}</div>
        </div>

        {specs.length > 0 ? (
          <div className="surface-card rounded-3xl p-5">
            <div className="text-sm font-semibold text-zinc-900">Características</div>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-zinc-700">
              {specs.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-amber-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {fpsGames.length > 0 ? (
          <div className="surface-card rounded-3xl p-5">
            <div className="text-sm font-semibold text-zinc-900">FPS en juegos del momento</div>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-zinc-700">
              {fpsGames.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-zinc-900" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
