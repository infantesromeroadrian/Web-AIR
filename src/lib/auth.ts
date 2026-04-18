import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "air_admin_session";
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_KEYLEN = 32;
const SCRYPT_SALT_LEN = 16;

function env(key: string): string | null {
  const viteEnv = (import.meta as { env?: Record<string, string | undefined> }).env;
  return viteEnv?.[key] ?? process.env[key] ?? null;
}

function getSecret(): string | null {
  const secret = env("ADMIN_SECRET");
  if (!secret || secret.length < 32) return null;
  return secret;
}

function getPasswordHash(): string | null {
  return env("ADMIN_PASSWORD_HASH");
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export interface AuthResult {
  ok: boolean;
  reason?: "no_secret" | "no_cookie" | "expired" | "bad_signature";
}

export function verifyAuth(request: Request): AuthResult {
  const secret = getSecret();
  if (!secret) return { ok: false, reason: "no_secret" };

  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`)
  );
  if (!match) return { ok: false, reason: "no_cookie" };

  const [payload, signature] = decodeURIComponent(match[1]).split(".");
  if (!payload || !signature) return { ok: false, reason: "bad_signature" };

  const expected = sign(payload, secret);
  try {
    const sigBuf = Buffer.from(signature, "hex");
    const expBuf = Buffer.from(expected, "hex");
    if (sigBuf.length !== expBuf.length) {
      return { ok: false, reason: "bad_signature" };
    }
    if (!timingSafeEqual(sigBuf, expBuf)) {
      return { ok: false, reason: "bad_signature" };
    }
  } catch {
    return { ok: false, reason: "bad_signature" };
  }

  const exp = parseInt(payload, 10);
  if (Number.isNaN(exp) || exp < Date.now()) {
    return { ok: false, reason: "expired" };
  }

  return { ok: true };
}

export function hashPassword(plain: string): string {
  const salt = randomBytes(SCRYPT_SALT_LEN);
  const derived = scryptSync(plain, salt, SCRYPT_KEYLEN, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
  });
  return [
    "scrypt",
    SCRYPT_N,
    SCRYPT_R,
    SCRYPT_P,
    salt.toString("hex"),
    derived.toString("hex"),
  ].join("$");
}

export function verifyPassword(submitted: string): boolean {
  const stored = getPasswordHash();
  if (!stored) return false;

  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;

  const N = parseInt(parts[1], 10);
  const r = parseInt(parts[2], 10);
  const p = parseInt(parts[3], 10);
  if (!Number.isFinite(N) || !Number.isFinite(r) || !Number.isFinite(p)) return false;

  let salt: Buffer;
  let expected: Buffer;
  try {
    salt = Buffer.from(parts[4], "hex");
    expected = Buffer.from(parts[5], "hex");
  } catch {
    return false;
  }
  if (salt.length === 0 || expected.length === 0) return false;

  let derived: Buffer;
  try {
    derived = scryptSync(submitted, salt, expected.length, { N, r, p });
  } catch {
    return false;
  }

  if (derived.length !== expected.length) return false;
  return timingSafeEqual(derived, expected);
}

export function createSessionCookie(): string {
  const secret = getSecret();
  if (!secret) throw new Error("ADMIN_SECRET not configured or too short (min 32 chars)");

  const exp = Date.now() + SESSION_DURATION_MS;
  const payload = String(exp);
  const signature = sign(payload, secret);
  const value = encodeURIComponent(`${payload}.${signature}`);

  const maxAge = Math.floor(SESSION_DURATION_MS / 1000);
  return `${COOKIE_NAME}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Strict`;
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`;
}
