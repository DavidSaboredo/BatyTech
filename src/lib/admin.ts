import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export const OWNER_LOGIN_PATH = "/ingreso-batytech";
export const OWNER_PANEL_PATH = "/gestion-batytech";

export function ownerAdminPath(path = "") {
  const normalized = path.replace(/^\/+/, "");
  return normalized ? `${OWNER_PANEL_PATH}/${normalized}` : OWNER_PANEL_PATH;
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect(OWNER_LOGIN_PATH);
  return session;
}
