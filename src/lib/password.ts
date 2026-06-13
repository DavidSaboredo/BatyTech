import crypto from "node:crypto";

type ScryptParams = {
  N: number;
  r: number;
  p: number;
  salt: Buffer;
  hash: Buffer;
};

function encodeBase64Url(buf: Buffer) {
  return buf
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function decodeBase64Url(input: string) {
  const normalized = input.replaceAll("-", "+").replaceAll("_", "/");
  const pad = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return Buffer.from(normalized + pad, "base64");
}

function parseHash(stored: string): ScryptParams | null {
  const parts = stored.split("$");
  if (parts.length !== 6) return null;
  const [scheme, N, r, p, saltB64, hashB64] = parts;
  if (scheme !== "scrypt") return null;

  const n = Number(N);
  const rr = Number(r);
  const pp = Number(p);
  if (!Number.isFinite(n) || !Number.isFinite(rr) || !Number.isFinite(pp)) return null;

  const salt = decodeBase64Url(saltB64);
  const hash = decodeBase64Url(hashB64);

  if (salt.length < 8 || hash.length < 16) return null;

  return { N: n, r: rr, p: pp, salt, hash };
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16);
  const N = 16384;
  const r = 8;
  const p = 1;
  const hash = crypto.scryptSync(password, salt, 32, { N, r, p });
  return `scrypt$${N}$${r}$${p}$${encodeBase64Url(salt)}$${encodeBase64Url(hash)}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const parsed = parseHash(storedHash);
  if (!parsed) return false;

  const computed = crypto.scryptSync(password, parsed.salt, parsed.hash.length, {
    N: parsed.N,
    r: parsed.r,
    p: parsed.p,
  });

  return crypto.timingSafeEqual(computed, parsed.hash);
}
