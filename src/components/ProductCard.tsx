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
    <div className="flex flex-col overflow-hidden rounded-2xl border bg-white">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative h-44 w-full bg-zinc-50">
          <Image src={product.imageUrl} alt={product.name} fill className="object-contain p-8" />
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/products/${product.slug}`} className="font-medium leading-6 hover:underline">
          {product.name}
        </Link>
        <div className="text-sm text-zinc-600">{formatMoney(product.priceCents)}</div>
        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="text-xs text-zinc-500">{disabled ? "Sin stock" : `Stock: ${product.stock}`}</div>
          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              priceCents: product.priceCents,
              imageUrl: product.imageUrl,
              stock: product.stock,
            }}
            className="rounded-full border border-amber-400 bg-amber-400 px-3 py-1.5 text-xs font-semibold text-zinc-900 hover:bg-amber-300 disabled:opacity-40"
          />
        </div>
      </div>
    </div>
  );
}
