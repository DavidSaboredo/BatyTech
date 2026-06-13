import Link from "next/link";
import { redirect } from "next/navigation";
import { OWNER_LOGIN_PATH, ownerAdminPath, requireAdmin } from "@/lib/admin";
import { clearSessionCookie } from "@/lib/session";

export const dynamic = "force-dynamic";
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

async function logoutAction() {
  "use server";
  await clearSessionCookie();
  redirect(OWNER_LOGIN_PATH);
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="flex flex-col gap-6">
      <div className="surface-card flex flex-col gap-4 rounded-3xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-amber-600">Acceso privado</div>
            <div className="mt-1 text-lg font-semibold text-zinc-950">Panel Admin</div>
          </div>
          <Link href="/" className="rounded-full border border-zinc-900 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-900 hover:text-white">
            Ver tienda
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Link href={ownerAdminPath()} className="rounded-full border border-zinc-200 bg-white px-3 py-2 font-medium text-zinc-700 hover:border-amber-400 hover:text-zinc-950">
            Dashboard
          </Link>
          <Link href={ownerAdminPath("products")} className="rounded-full border border-zinc-200 bg-white px-3 py-2 font-medium text-zinc-700 hover:border-amber-400 hover:text-zinc-950">
            Productos
          </Link>
          <Link href={ownerAdminPath("categories")} className="rounded-full border border-zinc-200 bg-white px-3 py-2 font-medium text-zinc-700 hover:border-amber-400 hover:text-zinc-950">
            Categorías
          </Link>
          <Link href={ownerAdminPath("brands")} className="rounded-full border border-zinc-200 bg-white px-3 py-2 font-medium text-zinc-700 hover:border-amber-400 hover:text-zinc-950">
            Marcas
          </Link>
          <Link href={ownerAdminPath("orders")} className="rounded-full border border-zinc-200 bg-white px-3 py-2 font-medium text-zinc-700 hover:border-amber-400 hover:text-zinc-950">
            Órdenes
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="rounded-full border border-amber-400 bg-amber-400 px-3 py-2 font-semibold text-zinc-900 hover:bg-amber-300">
              Salir
            </button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}
