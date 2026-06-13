"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/CartProvider";

export function Header() {
  const { totalQuantity } = useCart();
  const pathname = usePathname();

  const navItemClass = (active: boolean) =>
    active
      ? "rounded-full border border-zinc-900 bg-zinc-900 px-4 py-2 font-medium text-white shadow-sm"
      : "rounded-full border border-zinc-200 bg-white px-4 py-2 font-medium text-zinc-800 hover:border-amber-400 hover:text-zinc-950";

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur">
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
            className={navItemClass(pathname === "/")}
          >
            Inicio
          </Link>
          <Link
            href="/products"
            className={navItemClass(pathname === "/products" || pathname.startsWith("/products/"))}
          >
            Productos
          </Link>
          <Link
            href="/cart"
            className={navItemClass(pathname === "/cart" || pathname === "/checkout")}
            aria-label="Carrito"
          >
            Carrito ({totalQuantity})
          </Link>
        </nav>
      </div>
    </header>
  );
}
