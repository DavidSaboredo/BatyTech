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
      <div className="flex flex-col gap-4 rounded-3xl border border-amber-300 bg-zinc-950 p-5 text-white shadow-[0_18px_40px_rgba(0,0,0,0.22)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-amber-300">Acceso privado</div>
            <div className="mt-1 text-lg font-semibold text-white">Panel Admin</div>
          </div>
          <Link href="/" className="rounded-full border border-white px-4 py-2 text-sm font-medium text-white hover:bg-white hover:text-zinc-900">
            Ver tienda
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Link href={ownerAdminPath()} className="rounded-full border border-amber-400 bg-zinc-900 px-3 py-2 text-amber-300 hover:bg-black">
            Dashboard
          </Link>
          <Link href={ownerAdminPath("products")} className="rounded-full border border-amber-400 bg-zinc-900 px-3 py-2 text-amber-300 hover:bg-black">
            Productos
          </Link>
          <Link href={ownerAdminPath("categories")} className="rounded-full border border-amber-400 bg-zinc-900 px-3 py-2 text-amber-300 hover:bg-black">
            Categorías
          </Link>
          <Link href={ownerAdminPath("brands")} className="rounded-full border border-amber-400 bg-zinc-900 px-3 py-2 text-amber-300 hover:bg-black">
            Marcas
          </Link>
          <Link href={ownerAdminPath("orders")} className="rounded-full border border-amber-400 bg-zinc-900 px-3 py-2 text-amber-300 hover:bg-black">
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
