"use client";

import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/AddToCartButton";
import { getPerformanceTierLabel } from "@/lib/performance-tier";
import { formatMoney } from "@/lib/money";

export type ProductCardModel = {
  id: string;
  name: string;
  slug: string;
  priceCents: number;
  stock: number;
  imageUrl: string;
  performanceTier?: string | null;
};

export function ProductCard({ product }: { product: ProductCardModel }) {
  const disabled = product.stock <= 0;
  const performanceTierLabel = getPerformanceTierLabel(product.performanceTier);

  return (
    <div className="surface-card flex h-full flex-col overflow-hidden rounded-3xl">
      <div className="h-1.5 bg-amber-400" />
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative h-48 w-full bg-zinc-50">
          <Image src={product.imageUrl} alt={product.name} fill className="object-contain p-8" />
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        {performanceTierLabel ? (
          <div className="inline-flex w-fit rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700">
            Gama {performanceTierLabel}
          </div>
        ) : null}
        <Link href={`/products/${product.slug}`} className="line-clamp-2 min-h-12 text-base font-semibold leading-6 hover:text-amber-700">
          {product.name}
        </Link>
        <div className="text-lg font-semibold text-zinc-900">{formatMoney(product.priceCents)}</div>
        <div className="mt-auto flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <div className="text-[11px] uppercase tracking-wide text-zinc-400">Disponibilidad</div>
            <div className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium ${disabled ? "bg-red-50 text-red-600" : "bg-zinc-100 text-zinc-700"}`}>
              {disabled ? "Sin stock" : `${product.stock} en stock`}
            </div>
          </div>
          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              priceCents: product.priceCents,
              imageUrl: product.imageUrl,
              stock: product.stock,
            }}
            className="inline-flex min-h-10 self-start items-center justify-center rounded-full border border-zinc-900 bg-zinc-900 px-5 py-2 text-sm font-semibold whitespace-nowrap text-white shadow-sm hover:border-amber-400 hover:bg-zinc-950 hover:text-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
          />
        </div>
      </div>
    </div>
  );
}
