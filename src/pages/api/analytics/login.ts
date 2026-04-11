import type { APIRoute } from "astro";
import { verifyPassword, createSessionCookie } from "../../../lib/auth";

export const prerender = false;

const loginAttempts = new Map<string, number[]>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const attempts = (loginAttempts.get(ip) ?? []).filter((t) => t > windowStart);
  if (attempts.length >= MAX_ATTEMPTS) return false;
  attempts.push(now);
  loginAttempts.set(ip, attempts);
  return true;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ip = clientAddress ?? request.headers.get("x-forwarded-for") ?? "unknown";

  if (!checkRateLimit(ip)) {
    return new Response(
      JSON.stringify({ error: "Too many attempts. Try again later." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: { password?: unknown };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const password = typeof body.password === "string" ? body.password : "";
  if (!password || password.length > 200) {
    return new Response(JSON.stringify({ error: "Invalid password" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!verifyPassword(password)) {
    return new Response(
      JSON.stringify({ error: "Incorrect password" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const cookie = createSessionCookie();
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": cookie,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "Server misconfigured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
