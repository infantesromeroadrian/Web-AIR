import { getRedis } from "./redis";

const IPV4 = /^(\d{1,3}\.){3}\d{1,3}$/;
const IPV6 =
  /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::1|([0-9a-fA-F]{1,4}:){1,7}:|:(:[0-9a-fA-F]{1,4}){1,7})$/;

export function getClientIp(request: Request, clientAddress?: string): string {
  if (clientAddress && isValidIp(clientAddress)) return clientAddress;

  const xff = request.headers.get("x-forwarded-for") ?? "";
  const first = xff.split(",")[0]?.trim();
  if (first && isValidIp(first)) return first;

  const real = request.headers.get("x-real-ip")?.trim();
  if (real && isValidIp(real)) return real;

  return "unknown";
}

function isValidIp(candidate: string): boolean {
  if (!candidate || candidate.length > 45) return false;
  return IPV4.test(candidate) || IPV6.test(candidate);
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetMs: number;
}

const memoryStore = new Map<string, number[]>();

export async function checkRateLimit(
  bucket: string,
  ip: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStart = now - windowMs;
  const key = `rl:${bucket}:${ip}`;

  const redis = getRedis();
  if (redis) {
    try {
      const member = `${now}-${Math.random().toString(36).slice(2, 10)}`;
      const pipe = redis.pipeline();
      pipe.zremrangebyscore(key, 0, windowStart);
      pipe.zadd(key, { score: now, member });
      pipe.zcard(key);
      pipe.pexpire(key, windowMs + 1000);
      const results = (await pipe.exec()) as unknown[];
      const count = Number(results[2] ?? 0);

      if (count > limit) {
        return {
          allowed: false,
          remaining: 0,
          limit,
          resetMs: windowMs,
        };
      }
      return {
        allowed: true,
        remaining: Math.max(0, limit - count),
        limit,
        resetMs: windowMs,
      };
    } catch (err) {
      console.error("Rate limit Redis failure, falling back to memory:", err);
    }
  }

  const timestamps = (memoryStore.get(key) ?? []).filter((t) => t > windowStart);
  if (timestamps.length >= limit) {
    memoryStore.set(key, timestamps);
    return { allowed: false, remaining: 0, limit, resetMs: windowMs };
  }
  timestamps.push(now);
  memoryStore.set(key, timestamps);
  return {
    allowed: true,
    remaining: Math.max(0, limit - timestamps.length),
    limit,
    resetMs: windowMs,
  };
}

export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetMs / 1000)),
  };
}
