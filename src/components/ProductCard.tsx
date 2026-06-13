"use client";

import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/AddToCartButton";
import { formatMoney } from "@/lib/money";

export type ProductCardModel = {
  id: string;
  name: string;
  slug: string;
  priceCents: number;
  stock: number;
  imageUrl: string;
};

export function ProductCard({ product }: { product: ProductCardModel }) {
  const disabled = product.stock <= 0;

  return (
    <div className="surface-card flex h-full flex-col overflow-hidden rounded-3xl">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative h-48 w-full bg-gradient-to-br from-white to-amber-50/60">
          <Image src={product.imageUrl} alt={product.name} fill className="object-contain p-8" />
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Link href={`/products/${product.slug}`} className="line-clamp-2 min-h-12 text-base font-semibold leading-6 hover:text-amber-700">
          {product.name}
        </Link>
        <div className="text-lg font-semibold text-zinc-900">{formatMoney(product.priceCents)}</div>
        <div className="mt-auto flex items-end justify-between gap-3">
          <div className="flex flex-col gap-1">
            <div className="text-[11px] uppercase tracking-wide text-zinc-400">Disponibilidad</div>
            <div className={`text-xs font-medium ${disabled ? "text-red-600" : "text-zinc-600"}`}>
              {disabled ? "Sin stock" : `Stock: ${product.stock}`}
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
            className="rounded-full border border-amber-400 bg-amber-400 px-3 py-2 text-xs font-semibold text-zinc-900 shadow-sm hover:bg-amber-300 disabled:opacity-40"
          />
        </div>
      </div>
    </div>
  );
}
