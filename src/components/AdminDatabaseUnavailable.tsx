import Link from "next/link";
import { OWNER_LOGIN_PATH } from "@/lib/admin";

export function AdminDatabaseUnavailable({ scope }: { scope: string }) {
  return (
    <div className="surface-card rounded-3xl p-6">
      <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
        Base desconectada
      </div>
      <h1 className="mt-4 text-2xl font-semibold text-zinc-950">No se puede usar {scope} en local</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
        El panel necesita una conexión real a PostgreSQL/Neon para listar, editar o guardar cambios. La tienda pública
        puede mostrar datos de ejemplo, pero el admin no puede hacer CRUD sin base.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={OWNER_LOGIN_PATH}
          className="rounded-full border border-zinc-900 bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:border-amber-400 hover:text-amber-300"
        >
          Volver al login
        </Link>
        <Link
          href="/"
          className="rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-800 hover:border-amber-400 hover:text-zinc-950"
        >
          Ir a la tienda
        </Link>
      </div>
    </div>
  );
}
