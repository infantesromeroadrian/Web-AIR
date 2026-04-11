import type { APIRoute } from "astro";
import { verifyAuth } from "../../../lib/auth";
import { readAnalytics } from "../../../lib/redis";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const auth = verifyAuth(request);
  if (!auth.ok) {
    return new Response(
      JSON.stringify({ error: "Unauthorized", reason: auth.reason }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      }
    );
  }

  const snapshot = await readAnalytics();
  if (!snapshot) {
    return new Response(
      JSON.stringify({
        error: "Analytics storage unavailable",
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return new Response(JSON.stringify(snapshot), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
};
