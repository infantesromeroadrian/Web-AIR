import type { APIRoute } from "astro";
import { verifyPassword, createSessionCookie } from "../../../lib/auth";
import { checkRateLimit, getClientIp, rateLimitHeaders } from "../../../lib/rate-limit";

export const prerender = false;

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ip = getClientIp(request, clientAddress);

  const rl = await checkRateLimit("admin-login", ip, MAX_ATTEMPTS, WINDOW_MS);
  if (!rl.allowed) {
    return new Response(
      JSON.stringify({ error: "Too many attempts. Try again later." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          ...rateLimitHeaders(rl),
        },
      }
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
