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
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white p-4">
        <div className="text-sm font-semibold">Panel Admin</div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Link href="/" className="rounded-full border px-3 py-1.5 hover:bg-zinc-50">
            Ver tienda
          </Link>
          <Link href={ownerAdminPath()} className="hover:underline">
            Dashboard
          </Link>
          <Link href={ownerAdminPath("products")} className="hover:underline">
            Productos
          </Link>
          <Link href={ownerAdminPath("categories")} className="hover:underline">
            Categorías
          </Link>
          <Link href={ownerAdminPath("brands")} className="hover:underline">
            Marcas
          </Link>
          <Link href={ownerAdminPath("orders")} className="hover:underline">
            Órdenes
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="rounded-full border px-3 py-1.5 hover:bg-zinc-50">
              Salir
            </button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}
