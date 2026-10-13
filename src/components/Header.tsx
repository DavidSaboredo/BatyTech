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
      ? "inline-flex items-center gap-2 rounded-full border border-zinc-900 bg-zinc-900 px-3 py-2 font-medium text-white shadow-sm sm:px-4"
      : "inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-2 font-medium text-zinc-800 hover:border-amber-400 hover:text-zinc-950 sm:px-4";

  const cartActive = pathname === "/cart" || pathname === "/checkout";

  return (
    <header className="sticky top-0 z-40 border-b border-amber-300/40 bg-gradient-to-r from-amber-200 via-amber-100 to-zinc-950/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:py-3">
        <Link href="/" className="flex shrink-0 items-center" aria-label="BatysTech, ir al inicio">
          <Image
            src="/brand/batystech-logo.png"
            alt="BatysTech"
            width={1200}
            height={143}
            priority
            className="h-auto w-[148px] min-[380px]:w-[170px] sm:w-[240px] md:w-[280px]"
          />
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-1.5 text-sm text-zinc-900 sm:gap-3">
          <Link href="/" className={`max-sm:hidden ${navItemClass(pathname === "/")}`}>
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
            className={navItemClass(cartActive)}
            aria-label={`Carrito, ${totalQuantity} ${totalQuantity === 1 ? "producto" : "productos"}`}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-[18px] w-[18px]"
            >
              <circle cx="9" cy="20" r="1.4" />
              <circle cx="18" cy="20" r="1.4" />
              <path d="M2.5 3.5h2.6l2.4 11.2a1.6 1.6 0 0 0 1.6 1.3h8.6a1.6 1.6 0 0 0 1.6-1.2l1.7-7.3H6.1" />
            </svg>
            <span className="max-sm:hidden">Carrito</span>
            <span
              className={`min-w-5 rounded-full px-1.5 text-center text-xs font-semibold leading-5 ${
                cartActive ? "bg-amber-400 text-zinc-950" : "bg-zinc-900 text-white"
              }`}
            >
              {totalQuantity}
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
