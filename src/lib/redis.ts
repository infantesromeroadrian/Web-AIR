import { Redis } from "@upstash/redis";

let client: Redis | null = null;

export function getRedis(): Redis | null {
  if (client) return client;

  const url =
    import.meta.env.UPSTASH_REDIS_REST_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token =
    import.meta.env.UPSTASH_REDIS_REST_TOKEN ??
    process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  client = new Redis({ url, token });
  return client;
}

export interface AnalyticsSnapshot {
  total: number;
  paths: Array<{ path: string; count: number }>;
  countries: Array<{ country: string; count: number }>;
  devices: Array<{ device: string; count: number }>;
  referrers: Array<{ referrer: string; count: number }>;
  dailyVisits: Array<{ day: string; count: number }>;
  firstVisit: string | null;
  lastVisit: string | null;
}

const KEYS = {
  total: "analytics:total",
  firstVisit: "analytics:first_visit",
  lastVisit: "analytics:last_visit",
  pathHash: "analytics:paths",
  countryHash: "analytics:countries",
  deviceHash: "analytics:devices",
  referrerHash: "analytics:referrers",
  dayHash: "analytics:days",
} as const;

export interface VisitEvent {
  path: string;
  country: string;
  device: string;
  referrer: string;
}

export async function trackVisit(event: VisitEvent): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  const now = new Date().toISOString();
  const day = now.slice(0, 10);

  try {
    await Promise.all([
      redis.incr(KEYS.total),
      redis.hincrby(KEYS.pathHash, event.path, 1),
      redis.hincrby(KEYS.countryHash, event.country, 1),
      redis.hincrby(KEYS.deviceHash, event.device, 1),
      redis.hincrby(KEYS.referrerHash, event.referrer, 1),
      redis.hincrby(KEYS.dayHash, day, 1),
      redis.set(KEYS.lastVisit, now),
      redis.setnx(KEYS.firstVisit, now),
    ]);
  } catch (err) {
    console.error("Analytics track failed:", err);
  }
}

function sortEntries(
  entries: Record<string, string | number>,
  limit = 10
): Array<{ key: string; count: number }> {
  return Object.entries(entries)
    .map(([key, value]) => ({ key, count: Number(value) }))
    .filter((e) => !Number.isNaN(e.count) && e.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export async function readAnalytics(): Promise<AnalyticsSnapshot | null> {
  const redis = getRedis();
  if (!redis) return null;

  try {
    const [
      total,
      firstVisit,
      lastVisit,
      paths,
      countries,
      devices,
      referrers,
      days,
    ] = await Promise.all([
      redis.get<number>(KEYS.total),
      redis.get<string>(KEYS.firstVisit),
      redis.get<string>(KEYS.lastVisit),
      redis.hgetall<Record<string, string>>(KEYS.pathHash),
      redis.hgetall<Record<string, string>>(KEYS.countryHash),
      redis.hgetall<Record<string, string>>(KEYS.deviceHash),
      redis.hgetall<Record<string, string>>(KEYS.referrerHash),
      redis.hgetall<Record<string, string>>(KEYS.dayHash),
    ]);

    return {
      total: total ?? 0,
      firstVisit: firstVisit ?? null,
      lastVisit: lastVisit ?? null,
      paths: sortEntries(paths ?? {}, 10).map((e) => ({
        path: e.key,
        count: e.count,
      })),
      countries: sortEntries(countries ?? {}, 10).map((e) => ({
        country: e.key,
        count: e.count,
      })),
      devices: sortEntries(devices ?? {}, 5).map((e) => ({
        device: e.key,
        count: e.count,
      })),
      referrers: sortEntries(referrers ?? {}, 10).map((e) => ({
        referrer: e.key,
        count: e.count,
      })),
      dailyVisits: Object.entries(days ?? {})
        .map(([day, count]) => ({ day, count: Number(count) }))
        .filter((e) => !Number.isNaN(e.count))
        .sort((a, b) => (a.day > b.day ? 1 : -1))
        .slice(-30),
    };
  } catch (err) {
    console.error("Analytics read failed:", err);
    return null;
  }
}

export async function resetAnalytics(): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;
  try {
    await Promise.all(
      Object.values(KEYS).map((key) => redis.del(key))
    );
    return true;
  } catch (err) {
    console.error("Analytics reset failed:", err);
    return false;
  }
}
