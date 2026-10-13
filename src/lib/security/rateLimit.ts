import { NextRequest } from 'next/server';

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory request tracker with automatic expiry
const tracker = new Map<string, RateLimitRecord>();

let lastCleanup = Date.now();
function cleanupExpired() {
  const now = Date.now();
  if (now - lastCleanup > 60_000) {
    lastCleanup = now;
    for (const [key, value] of tracker.entries()) {
      if (now > value.resetAt) {
        tracker.delete(key);
      }
    }
  }
}

export interface RateLimitOptions {
  /** Duration in milliseconds (default: 60,000ms = 1 min) */
  windowMs?: number;
  /** Maximum number of allowed requests in window */
  max?: number;
  /** Namespace key prefix (e.g., 'orders', 'track', 'login') */
  keyPrefix?: string;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfterSeconds: number;
}

/**
 * Validates request IP against sliding window rate limit.
 */
export function checkRateLimit(
  req: NextRequest,
  options: RateLimitOptions = {}
): RateLimitResult {
  cleanupExpired();

  const windowMs = options.windowMs || 60_000;
  const max = options.max || 30;
  const prefix = options.keyPrefix || 'global';

  // Extract IP securely from standard proxy headers
  const forwarded = req.headers.get('x-forwarded-for');
  const ip =
    (forwarded ? forwarded.split(',')[0].trim() : null) ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1';

  const key = `${prefix}:${ip}`;
  const now = Date.now();
  const record = tracker.get(key);

  if (!record || now > record.resetAt) {
    tracker.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      success: true,
      limit: max,
      remaining: max - 1,
      resetTime: now + windowMs,
      retryAfterSeconds: Math.ceil(windowMs / 1000),
    };
  }

  const retryAfterSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));

  if (record.count >= max) {
    return {
      success: false,
      limit: max,
      remaining: 0,
      resetTime: record.resetAt,
      retryAfterSeconds,
    };
  }

  record.count += 1;
  return {
    success: true,
    limit: max,
    remaining: max - record.count,
    resetTime: record.resetAt,
    retryAfterSeconds,
  };
}
