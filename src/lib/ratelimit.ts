/**
 * Sliding-window rate limiter for the resolver: 60 requests per minute
 * per client IP. In-memory and therefore per-instance; on serverless
 * deploys each instance counts separately, which is acceptable for v0.
 */

const WINDOW_MS = 60_000;
export const LIMIT_PER_WINDOW = 60;

const hits = new Map<string, number[]>();

export interface RateResult {
  allowed: boolean;
  /** Seconds to wait before retrying, when not allowed. */
  retryAfterSeconds: number;
}

export function checkRateLimit(
  key: string,
  now: number = Date.now(),
): RateResult {
  const windowStart = now - WINDOW_MS;
  const previous = hits.get(key) ?? [];
  const recent = previous.filter((t) => t > windowStart);

  if (recent.length >= LIMIT_PER_WINDOW) {
    hits.set(key, recent);
    const oldest = recent[0];
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((oldest + WINDOW_MS - now) / 1000)),
    };
  }

  recent.push(now);
  hits.set(key, recent);

  // Opportunistic cleanup so idle keys do not accumulate forever.
  if (hits.size > 10_000) {
    for (const [k, v] of hits) {
      if (v.every((t) => t <= windowStart)) hits.delete(k);
    }
  }

  return { allowed: true, retryAfterSeconds: 0 };
}
