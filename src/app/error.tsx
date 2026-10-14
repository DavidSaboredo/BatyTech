"use client";

import Link from "next/link";
import { useEffect } from "react";
import { GeekCatSticker } from "@/components/GeekCatSticker";

export default function ErrorPage({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="surface-card mx-auto my-4 flex w-full max-w-xl flex-col items-center gap-3 rounded-3xl px-6 py-10 text-center sm:my-10">
      <GeekCatSticker name="coffee" size={130} />
      <h1 className="section-heading text-2xl font-semibold text-zinc-950">Algo salió mal</h1>
      <p className="muted-copy max-w-sm text-sm leading-6">
        Tuvimos un problema para cargar esta página. Probá de nuevo en unos segundos.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex min-h-11 items-center rounded-full border border-zinc-900 bg-zinc-900 px-5 text-sm font-semibold text-white hover:border-amber-400 hover:text-amber-300"
        >
          Reintentar
        </button>
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
