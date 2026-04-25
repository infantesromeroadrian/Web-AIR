import type { APIRoute } from "astro";
import { createHmac, timingSafeEqual } from "node:crypto";
import { checkRateLimit, getClientIp, rateLimitHeaders } from "../../lib/rate-limit";

export const prerender = false;

const MAX_ATTEMPTS = 10;
const WINDOW_MS = 60_000;
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000;

function env(key: string): string | null {
  const viteEnv = (import.meta as { env?: Record<string, string | undefined> }).env;
  return viteEnv?.[key] ?? process.env[key] ?? null;
}

function getSecret(): string | null {
  const s = env("ADMIN_SECRET");
  if (!s || s.length < 32) return null;
  return s;
}

function getPin(): string | null {
  const p = env("L4_GATE_PIN");
  if (!p || p.length < 4 || p.length > 128) return null;
  return p;
}

function constantTimeMatch(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  try {
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

function signToken(secret: string): string {
  const exp = Date.now() + TOKEN_TTL_MS;
  const payload = String(exp);
  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ip = getClientIp(request, clientAddress);

  const rl = await checkRateLimit("l4-gate", ip, MAX_ATTEMPTS, WINDOW_MS);
  if (!rl.allowed) {
    return new Response(
      JSON.stringify({ error: "Too many attempts. Try again later." }),
      {
        status: 429,
        headers: { "Content-Type": "application/json", ...rateLimitHeaders(rl) },
      }
    );
  }

  const expectedPin = getPin();
  const secret = getSecret();
  if (!expectedPin || !secret) {
    return new Response(
      JSON.stringify({ error: "Gate not configured." }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: { pin?: unknown };
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid body" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const submitted = typeof body.pin === "string" ? body.pin : "";
  if (!submitted || submitted.length > 128) {
    return new Response(
      JSON.stringify({ error: "Invalid pin" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!constantTimeMatch(submitted, expectedPin)) {
    return new Response(
      JSON.stringify({ error: "Access denied" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const token = signToken(secret);
  return new Response(
    JSON.stringify({ ok: true, token, ttl: TOKEN_TTL_MS }),
    {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    }
  );
};
