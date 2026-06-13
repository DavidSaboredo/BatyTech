import crypto from "node:crypto";
import { cookies } from "next/headers";

export const sessionCookieName = "batytech_session";

type SessionPayload = {
  sub: string;
  role: "ADMIN" | "CUSTOMER";
  exp: number;
};

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("AUTH_SECRET is required in production");
    }
    return "dev-secret-change-me";
  }
  return secret;
}

function encodeBase64Url(input: string) {
  return Buffer.from(input)
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function decodeBase64UrlToString(input: string) {
  const normalized = input.replaceAll("-", "+").replaceAll("_", "/");
  const pad = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return Buffer.from(normalized + pad, "base64").toString("utf8");
}

function sign(data: string) {
  return crypto
    .createHmac("sha256", getSecret())
    .update(data)
    .digest("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

export function createSessionToken(payload: Omit<SessionPayload, "exp">, days = 7) {
  const exp = Math.floor(Date.now() / 1000) + days * 24 * 60 * 60;
  const fullPayload: SessionPayload = { ...payload, exp };
  const encoded = encodeBase64Url(JSON.stringify(fullPayload));
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}

export function readSessionToken(token: string): SessionPayload | null {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;
  if (sign(encoded) !== signature) return null;

  try {
    const payload = JSON.parse(decodeBase64UrlToString(encoded)) as SessionPayload;
    if (!payload?.sub || !payload?.role || !payload?.exp) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string, days = 7) {
  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: days * 24 * 60 * 60,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;
  if (!token) return null;
  return readSessionToken(token);
}
