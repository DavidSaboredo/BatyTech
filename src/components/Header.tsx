"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export function Header() {
  const { totalQuantity } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-amber-300/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/brand/banner.jpeg"
            alt="BatyTech"
            width={260}
            height={56}
            priority
            className="h-10 w-[260px] object-cover object-[center_-14px] sm:h-12 sm:w-[300px] sm:object-[center_-18px]"
          />
        </Link>
        <nav className="flex items-center gap-2 text-sm text-zinc-900 sm:gap-3">
          <Link
            href="/"
            className="rounded-full px-3 py-2 font-medium hover:bg-zinc-900 hover:text-amber-300"
          >
            Inicio
          </Link>
          <Link
            href="/products"
            className="rounded-full px-3 py-2 font-medium hover:bg-zinc-900 hover:text-amber-300"
          >
            Productos
          </Link>
          <Link
            href="/cart"
            className="rounded-full border border-amber-400 bg-zinc-900 px-3 py-2 font-medium text-amber-300 shadow-sm hover:bg-black"
            aria-label="Carrito"
          >
            Carrito ({totalQuantity})
          </Link>
        </nav>
      </div>
    </header>
  );
}
