import { NextRequest, NextResponse } from 'next/server';

/**
 * Rate limit configuration for different endpoint types
 */
export interface RateLimitConfig {
  /** Maximum number of requests allowed within the window */
  maxRequests: number;
  /** Time window in milliseconds */
  windowMs: number;
  /** Custom message to return when rate limit is exceeded */
  message?: string;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

/**
 * In-memory rate limit store
 * In production, consider using Redis or another persistent store
 */
class RateLimitStore {
  private store: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Clean up expired entries every 60 seconds
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      const entries = Array.from(this.store.entries());
      for (const [key, entry] of entries) {
        if (entry.resetTime < now) {
          this.store.delete(key);
        }
      }
    }, 60000);
  }

  get(key: string): RateLimitEntry | undefined {
    const entry = this.store.get(key);
    if (entry && entry.resetTime < Date.now()) {
      this.store.delete(key);
      return undefined;
    }
    return entry;
  }

  set(key: string, entry: RateLimitEntry): void {
    this.store.set(key, entry);
  }

  clear(): void {
    this.store.clear();
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.clear();
  }
}

// Global rate limit store
const rateLimitStore = new RateLimitStore();

/**
 * Extract client identifier from request
 * Uses IP address as the primary identifier
 */
function getClientIdentifier(request: NextRequest): string {
  // Try to get real IP from headers (when behind proxy/CDN)
  const xRealIp = request.headers.get('x-real-ip');
  const xForwardedFor = request.headers.get('x-forwarded-for');

  // x-real-ip takes precedence, then first IP in x-forwarded-for
  const ip = xRealIp || xForwardedFor?.split(',')[0]?.trim() || 'unknown';

  return ip;
}

/**
 * Rate limiting middleware for API routes
 *
 * @param request - Next.js request object
 * @param config - Rate limit configuration
 * @param identifier - Optional custom identifier (defaults to IP-based)
 * @returns NextResponse if rate limit exceeded, null otherwise
 *
 * @example
 * ```ts
 * export async function POST(request: NextRequest) {
 *   const rateLimitResponse = await rateLimit(request, {
 *     maxRequests: 5,
 *     windowMs: 15 * 60 * 1000, // 15 minutes
 *   });
 *
 *   if (rateLimitResponse) {
 *     return rateLimitResponse;
 *   }
 *
 *   // Process request...
 * }
 * ```
 */
export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig,
  identifier?: string
): Promise<NextResponse | null> {
  const clientId = identifier || getClientIdentifier(request);
  const now = Date.now();

  // Create a unique key for this endpoint and client
  const endpoint = new URL(request.url).pathname;
  const key = `${endpoint}:${clientId}`;

  const entry = rateLimitStore.get(key);

  if (!entry) {
    // First request in this window
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return null;
  }

  if (entry.resetTime < now) {
    // Window has expired, reset the counter
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return null;
  }

  if (entry.count >= config.maxRequests) {
    // Rate limit exceeded
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);

    return NextResponse.json(
      {
        success: false,
        error: config.message || 'Too many requests. Please try again later.',
        retryAfter,
      },
      {
        status: 429,
        headers: {
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': config.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': entry.resetTime.toString(),
        },
      }
    );
  }

  // Increment the counter
  entry.count += 1;
  rateLimitStore.set(key, entry);

  return null;
}

/**
 * Predefined rate limit configurations for common use cases
 */
export const RateLimits = {
  /** Very strict: 3 requests per hour (for sensitive operations like email sending) */
  veryStrict: {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many requests. Please try again in an hour.',
  } as RateLimitConfig,

  /** Strict: 5 requests per 15 minutes (for user actions like signups) */
  strict: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many requests. Please try again in a few minutes.',
  } as RateLimitConfig,

  /** Moderate: 30 requests per minute (for regular API calls) */
  moderate: {
    maxRequests: 30,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many requests. Please slow down.',
  } as RateLimitConfig,

  /** Lenient: 60 requests per minute (for read-heavy operations) */
  lenient: {
    maxRequests: 60,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many requests. Please slow down.',
  } as RateLimitConfig,

  /** Very lenient: 100 requests per minute (for tracking/analytics) */
  veryLenient: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many requests. Please slow down.',
  } as RateLimitConfig,
} as const;

/**
 * Helper to clear rate limit store (useful for testing)
 */
export function clearRateLimitStore(): void {
  rateLimitStore.clear();
}

/**
 * Helper to destroy rate limit store (useful for cleanup in tests)
 */
export function destroyRateLimitStore(): void {
  rateLimitStore.destroy();
}