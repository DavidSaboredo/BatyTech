import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { GeekCatSticker } from "@/components/GeekCatSticker";
import { formatMoney } from "@/lib/money";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await params;
  const product = await prisma.product.findUnique({
    where: { slug: p.slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: true,
      brand: true,
    },
  });

  if (!product || !product.isActive) notFound();

  const imageUrl = product.images[0]?.url || "/window.svg";

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="overflow-hidden rounded-2xl border bg-white">
        <div className="relative h-80 w-full bg-zinc-50">
          <Image src={imageUrl} alt={product.name} fill className="object-contain p-10" priority />
        </div>
        {product.images.length > 1 ? (
          <div className="grid grid-cols-4 gap-2 border-t bg-white p-3">
            {product.images.slice(0, 4).map((img) => (
              <div key={img.id} className="relative h-16 overflow-hidden rounded-xl border bg-zinc-50">
                <Image src={img.url} alt={img.alt} fill className="object-contain p-4" />
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-600">
          <Link href="/products" className="hover:text-amber-600 hover:underline underline-offset-4">
            Productos
          </Link>
          <span>/</span>
          <Link
            href={`/products?category=${product.category.slug}`}
            className="hover:text-amber-600 hover:underline underline-offset-4"
          >
            {product.category.name}
          </Link>
          <span>/</span>
          <Link href={`/products?brand=${product.brand.slug}`} className="hover:text-amber-600 hover:underline underline-offset-4">
            {product.brand.name}
          </Link>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
        <div className="text-sm text-zinc-600">SKU: {product.sku}</div>
        <div className="flex items-center gap-3">
          <div className="text-2xl font-semibold">{formatMoney(product.priceCents)}</div>
          <div className="pointer-events-none hidden opacity-70 sm:block">
            <GeekCatSticker name="gamerRage" size={52} />
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm text-zinc-600">{product.stock > 0 ? `Stock: ${product.stock}` : "Sin stock"}</div>
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                priceCents: product.priceCents,
                imageUrl,
                stock: product.stock,
              }}
            />
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-4">
          <div className="text-sm font-medium">Descripción</div>
          <div className="mt-2 whitespace-pre-wrap text-sm text-zinc-700">{product.description}</div>
        </div>
      </div>
    </div>
  );
}
