import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "air_admin_session";
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours

function getSecret(): string | null {
  return (
    import.meta.env.ADMIN_SECRET ??
    process.env.ADMIN_SECRET ??
    import.meta.env.ADMIN_PASSWORD ??
    process.env.ADMIN_PASSWORD ??
    null
  );
}

function getPassword(): string | null {
  return (
    import.meta.env.ADMIN_PASSWORD ?? process.env.ADMIN_PASSWORD ?? null
  );
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

export function verifyPassword(submitted: string): boolean {
  const password = getPassword();
  if (!password) return false;
  if (submitted.length !== password.length) return false;
  try {
    return timingSafeEqual(
      Buffer.from(submitted, "utf8"),
      Buffer.from(password, "utf8")
    );
  } catch {
    return false;
  }
}

export function createSessionCookie(): string {
  const secret = getSecret();
  if (!secret) throw new Error("ADMIN_SECRET not configured");

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
