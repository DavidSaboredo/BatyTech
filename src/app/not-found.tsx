import type { Metadata } from "next";
import Link from "next/link";
import { GeekCatSticker } from "@/components/GeekCatSticker";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="surface-card mx-auto my-4 flex w-full max-w-xl flex-col items-center gap-3 rounded-3xl px-6 py-10 text-center sm:my-10">
      <GeekCatSticker name="error404" size={140} priority />
      <h1 className="section-heading text-2xl font-semibold text-zinc-950">No encontramos esta página</h1>
      <p className="muted-copy max-w-sm text-sm leading-6">
        Puede que el enlace esté mal escrito o que el producto ya no esté disponible.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link
          href="/products"
          className="inline-flex min-h-11 items-center rounded-full border border-zinc-900 bg-zinc-900 px-5 text-sm font-semibold text-white hover:border-amber-400 hover:text-amber-300"
        >
          Ver productos
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-full border border-zinc-300 bg-white px-5 text-sm font-semibold text-zinc-900 hover:border-zinc-900"
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
