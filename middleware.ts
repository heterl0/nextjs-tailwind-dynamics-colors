import { NextRequest, NextResponse } from "next/server";

// Use Vercel's Edge Runtime for better performance
export const runtime = "edge";

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration - more lenient for Vercel free plan
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 50; // 50 requests per minute (increased for free plan)
const BLOCK_DURATION = 5 * 60 * 1000; // 5 minutes block for violations

// IP extraction function optimized for Vercel
function getClientIP(request: NextRequest): string {
  // Vercel specific headers
  const vercelIP = request.headers.get("x-vercel-forwarded-for");
  if (vercelIP) {
    return vercelIP.split(",")[0].trim();
  }

  // Check for forwarded headers (common in proxy setups)
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  // Check for real IP header
  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  // Fallback to unknown if no IP found
  return "unknown";
}

// Rate limiting function
function isRateLimited(ip: string): {
  limited: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record) {
    // First request from this IP
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return {
      limited: false,
      remaining: MAX_REQUESTS_PER_WINDOW - 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    };
  }

  // Check if window has reset
  if (now > record.resetTime) {
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return {
      limited: false,
      remaining: MAX_REQUESTS_PER_WINDOW - 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    };
  }

  // Check if rate limit exceeded
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return { limited: true, remaining: 0, resetTime: record.resetTime };
  }

  // Increment count
  record.count++;
  rateLimitStore.set(ip, record);

  return {
    limited: false,
    remaining: MAX_REQUESTS_PER_WINDOW - record.count,
    resetTime: record.resetTime,
  };
}

// Clean up old entries periodically (optimized for Vercel)
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now > record.resetTime + BLOCK_DURATION) {
      rateLimitStore.delete(ip);
    }
  }
}, 60000); // Clean up every minute

export function middleware(request: NextRequest) {
  // Only apply to API routes
  if (!request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const clientIP = getClientIP(request);

  // Skip rate limiting for localhost in development
  if (
    process.env.NODE_ENV === "development" &&
    (clientIP === "127.0.0.1" || clientIP === "::1")
  ) {
    return NextResponse.next();
  }

  // Skip rate limiting for Vercel preview deployments (optional)
  if (process.env.VERCEL_ENV === "preview") {
    return NextResponse.next();
  }

  const rateLimit = isRateLimited(clientIP);

  if (rateLimit.limited) {
    return new NextResponse(
      JSON.stringify({
        error: "Rate limit exceeded",
        message: "Too many requests. Please try again later.",
        retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": Math.ceil(
            (rateLimit.resetTime - Date.now()) / 1000
          ).toString(),
          "X-RateLimit-Limit": MAX_REQUESTS_PER_WINDOW.toString(),
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
          "X-RateLimit-Reset": rateLimit.resetTime.toString(),
        },
      }
    );
  }

  // Add rate limit headers to response
  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Limit", MAX_REQUESTS_PER_WINDOW.toString());
  response.headers.set("X-RateLimit-Remaining", rateLimit.remaining.toString());
  response.headers.set("X-RateLimit-Reset", rateLimit.resetTime.toString());

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
