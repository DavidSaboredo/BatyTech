"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export function Header() {
  const { totalQuantity } = useCart();

  return (
    <header className="border-b border-amber-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center">
          <Image
            src="/brand/banner.jpeg"
            alt="BatyTech"
            width={260}
            height={56}
            priority
            className="h-10 w-[260px] object-cover object-[center_-14px] sm:h-12 sm:w-[300px] sm:object-[center_-18px]"
          />
        </Link>
        <nav className="flex items-center gap-4 text-sm text-zinc-900">
          <Link href="/" className="hover:text-amber-600 hover:underline underline-offset-4">
            Inicio
          </Link>
          <Link href="/products" className="hover:text-amber-600 hover:underline underline-offset-4">
            Productos
          </Link>
          <Link
            href="/cart"
            className="rounded-full border border-amber-300 bg-white px-3 py-1.5 text-zinc-900 hover:border-amber-400 hover:bg-amber-50"
            aria-label="Carrito"
          >
            Carrito ({totalQuantity})
          </Link>
        </nav>
      </div>
    </header>
  );
}
