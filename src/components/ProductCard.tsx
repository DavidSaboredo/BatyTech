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

function stockLabel(stock: number) {
  if (stock <= 0) return "Sin stock";
  if (stock === 1) return "Última unidad";
  if (stock <= 3) return `Últimas ${stock} unidades`;
  return `${stock} en stock`;
}

export function ProductCard({ product }: { product: ProductCardModel }) {
  const disabled = product.stock <= 0;
  const performanceTierLabel = getPerformanceTierLabel(product.performanceTier);
  const href = `/products/${product.slug}`;

  return (
    <div className="surface-card group flex h-full flex-col overflow-hidden rounded-2xl sm:rounded-3xl">
      <div className="h-1 bg-amber-400 sm:h-1.5" />
      <Link href={href} tabIndex={-1} aria-hidden="true" className="relative block aspect-square w-full bg-zinc-50 sm:aspect-auto sm:h-48">
        <Image
          src={product.imageUrl}
          alt=""
          fill
          sizes="(min-width: 1280px) 260px, (min-width: 640px) 45vw, 50vw"
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03] sm:p-8"
        />
        {performanceTierLabel ? (
          <span className="absolute left-2 top-2 rounded-full bg-zinc-950 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300 sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[11px]">
            Gama {performanceTierLabel}
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-3 sm:gap-3 sm:p-4">
        <Link
          href={href}
          className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-zinc-900 hover:text-amber-700 sm:min-h-12 sm:text-base sm:leading-6"
        >
          {product.name}
        </Link>
        <div className="text-base font-bold text-zinc-950 sm:text-lg">{formatMoney(product.priceCents)}</div>
        <div className="mt-auto flex flex-col gap-2 sm:gap-3">
          <div className={`flex items-center gap-1.5 text-xs font-medium ${disabled ? "text-red-600" : "text-emerald-700"}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${disabled ? "bg-red-500" : "bg-emerald-500"}`} />
            {stockLabel(product.stock)}
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
            compact
            className="inline-flex min-h-10 w-full items-center justify-center rounded-full border border-zinc-900 bg-zinc-900 px-3 py-2 text-[13px] font-semibold leading-tight text-white shadow-sm hover:border-amber-400 hover:bg-zinc-950 hover:text-amber-300 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
}
