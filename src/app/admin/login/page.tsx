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
    <div className="mx-auto w-full max-w-md rounded-2xl border bg-white p-6">
      <h1 className="text-xl font-semibold">Acceso privado</h1>
      <p className="mt-1 text-sm text-zinc-600">Ingresá para administrar productos, precios, imágenes y órdenes.</p>

      <form action={loginAction} className="mt-5 flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Email</label>
          <input name="email" type="email" required className="h-10 rounded-xl border px-3 text-sm" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Password</label>
          <input name="password" type="password" required className="h-10 rounded-xl border px-3 text-sm" />
        </div>

        <button type="submit" className="mt-2 rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white">
          Entrar
        </button>
      </form>
    </div>
  );
}
