import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { ownerAdminPath } from "@/lib/admin";
import { verifyPassword } from "@/lib/password";
import { createSessionToken, setSessionCookie } from "@/lib/session";

export const dynamic = "force-dynamic";

async function loginAction(formData: FormData) {
  "use server";

  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) return;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return;
  if (user.role !== "ADMIN") return;

  const ok = verifyPassword(password, user.passwordHash);
  if (!ok) return;

  const token = createSessionToken({ sub: user.id, role: "ADMIN" });
  await setSessionCookie(token);
  redirect(ownerAdminPath());
}

export default function AdminLoginPage() {
  return (
    <div className="surface-card mx-auto w-full max-w-md rounded-3xl p-7">
      <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
        Dueño / Admin
      </div>
      <h1 className="mt-4 text-2xl font-semibold text-zinc-950">Acceso privado</h1>
      <p className="mt-2 text-sm text-zinc-600">Ingresá para administrar productos, precios, imágenes y órdenes.</p>

      <form action={loginAction} className="mt-5 flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Email</label>
          <input
            name="email"
            type="email"
            required
            className="h-11 rounded-xl border px-3 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Password</label>
          <input
            name="password"
            type="password"
            required
            className="h-11 rounded-xl border px-3 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
          />
        </div>

        <button
          type="submit"
          className="mt-3 rounded-full border border-amber-400 bg-amber-400 px-5 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-amber-300"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
