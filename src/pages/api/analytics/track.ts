import type { APIRoute } from "astro";
import { trackVisit } from "../../../lib/redis";

export const prerender = false;

const BOT_PATTERNS = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /scraper/i,
  /facebookexternalhit/i,
  /slackbot/i,
  /twitterbot/i,
  /linkedinbot/i,
  /whatsapp/i,
  /telegrambot/i,
  /googlebot/i,
  /bingbot/i,
  /yandex/i,
  /duckduckbot/i,
  /applebot/i,
  /curl/i,
  /wget/i,
  /headlesschrome/i,
];

const ALLOWED_PATH_PATTERN = /^\/(?:l4tentnoise|blog\/?[\w-]*|admin\/?[\w-]*)?$/;

function isBot(userAgent: string): boolean {
  return BOT_PATTERNS.some((p) => p.test(userAgent));
}

function detectDevice(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (/mobile|iphone|android/.test(ua) && !/ipad|tablet/.test(ua)) return "mobile";
  if (/ipad|tablet/.test(ua)) return "tablet";
  return "desktop";
}

function normalizePath(path: unknown): string | null {
  if (typeof path !== "string") return null;
  const cleaned = path.split("?")[0].split("#")[0];
  if (cleaned.length > 100) return null;
  if (!cleaned.startsWith("/")) return null;
  if (!ALLOWED_PATH_PATTERN.test(cleaned)) return null;
  return cleaned;
}

function normalizeReferrer(referrer: string, host: string): string {
  if (!referrer) return "direct";
  try {
    const url = new URL(referrer);
    if (url.host === host || url.host.endsWith(`.${host}`)) return "internal";
    const domain = url.host.replace(/^www\./, "");
    if (domain.length > 60) return "unknown";
    return domain;
  } catch {
    return "unknown";
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const userAgent = request.headers.get("user-agent") ?? "";
    if (!userAgent || isBot(userAgent)) {
      return new Response(null, { status: 204 });
    }

    const body = await request.json().catch(() => null);
    const path = normalizePath(body?.path);
    if (!path) {
      return new Response(null, { status: 204 });
    }

    const country =
      request.headers.get("x-vercel-ip-country") ??
      request.headers.get("cf-ipcountry") ??
      "unknown";

    const referrer = normalizeReferrer(
      request.headers.get("referer") ?? "",
      new URL(request.url).host
    );

    await trackVisit({
      path,
      country: country.toLowerCase(),
      device: detectDevice(userAgent),
      referrer,
    });

    return new Response(null, {
      status: 204,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("Track endpoint error:", err);
    // Silent failure — analytics must never break the page
    return new Response(null, { status: 204 });
  }
};
