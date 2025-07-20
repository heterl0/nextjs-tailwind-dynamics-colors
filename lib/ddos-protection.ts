import { NextRequest } from "next/server";

// IP reputation tracking
const ipReputation = new Map<
  string,
  { score: number; lastSeen: number; violations: number }
>();

// Configuration
const MAX_VIOLATIONS = 5;
const REPUTATION_DECAY_TIME = 30 * 60 * 1000; // 30 minutes
const VIOLATION_SCORE = 10;
const GOOD_BEHAVIOR_SCORE = -1;

export interface DDoSProtectionConfig {
  maxRequestsPerMinute: number;
  maxRequestsPerHour: number;
  blockDuration: number;
  suspiciousPatterns: RegExp[];
}

export const defaultConfig: DDoSProtectionConfig = {
  maxRequestsPerMinute: 30,
  maxRequestsPerHour: 1000,
  blockDuration: 5 * 60 * 1000, // 5 minutes
  suspiciousPatterns: [
    /\.\./, // Directory traversal
    /<script/i, // XSS attempts
    /union\s+select/i, // SQL injection
    /eval\s*\(/i, // Code injection
  ],
};

// Check for suspicious request patterns
export function detectSuspiciousPatterns(request: NextRequest): string[] {
  const violations: string[] = [];
  const url = request.url;
  const userAgent = request.headers.get("user-agent") || "";

  // Check URL for suspicious patterns
  for (const pattern of defaultConfig.suspiciousPatterns) {
    if (pattern.test(url)) {
      violations.push(`Suspicious pattern in URL: ${pattern.source}`);
    }
  }

  // Check for missing or suspicious User-Agent
  if (!userAgent || userAgent.length < 10) {
    violations.push("Missing or suspicious User-Agent");
  }

  // Check for suspicious headers
  const suspiciousHeaders = [
    "x-forwarded-for",
    "x-real-ip",
    "cf-connecting-ip",
  ];
  for (const header of suspiciousHeaders) {
    const value = request.headers.get(header);
    if (value && !isValidIP(value)) {
      violations.push(`Invalid IP in header ${header}: ${value}`);
    }
  }

  return violations;
}

// Validate IP address format
function isValidIP(ip: string): boolean {
  const ipv4Pattern =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Pattern = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

  return ipv4Pattern.test(ip) || ipv6Pattern.test(ip);
}

// Update IP reputation
export function updateIPReputation(
  ip: string,
  isViolation: boolean
): { score: number; isBlocked: boolean } {
  const now = Date.now();
  const record = ipReputation.get(ip) || {
    score: 0,
    lastSeen: now,
    violations: 0,
  };

  // Decay old violations
  if (now - record.lastSeen > REPUTATION_DECAY_TIME) {
    record.score = Math.max(0, record.score - 5);
  }

  // Update score
  if (isViolation) {
    record.score += VIOLATION_SCORE;
    record.violations++;
  } else {
    record.score = Math.max(0, record.score + GOOD_BEHAVIOR_SCORE);
  }

  record.lastSeen = now;
  ipReputation.set(ip, record);

  return {
    score: record.score,
    isBlocked: record.violations >= MAX_VIOLATIONS || record.score > 50,
  };
}

// Clean up old reputation records
export function cleanupReputationStore(): void {
  const now = Date.now();
  for (const [ip, record] of ipReputation.entries()) {
    if (now - record.lastSeen > REPUTATION_DECAY_TIME * 2) {
      ipReputation.delete(ip);
    }
  }
}

// Get client IP with additional validation
export function getClientIP(request: NextRequest): string {
  // Check for Cloudflare headers
  const cfIP = request.headers.get("cf-connecting-ip");
  if (cfIP && isValidIP(cfIP)) {
    return cfIP;
  }

  // Check for forwarded headers
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const ips = forwarded.split(",").map((ip) => ip.trim());
    for (const ip of ips) {
      if (isValidIP(ip)) {
        return ip;
      }
    }
  }

  // Check for real IP header
  const realIP = request.headers.get("x-real-ip");
  if (realIP && isValidIP(realIP)) {
    return realIP;
  }

  return "unknown";
}

// Rate limiting with sliding window
export class SlidingWindowRateLimiter {
  private requests = new Map<string, number[]>();
  private windowSize: number;
  private maxRequests: number;

  constructor(windowSizeMs: number, maxRequests: number) {
    this.windowSize = windowSizeMs;
    this.maxRequests = maxRequests;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowSize;

    // Get existing requests for this identifier
    const requests = this.requests.get(identifier) || [];

    // Remove old requests outside the window
    const validRequests = requests.filter(
      (timestamp) => timestamp > windowStart
    );

    // Check if under limit
    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    // Add current request
    validRequests.push(now);
    this.requests.set(identifier, validRequests);

    return true;
  }

  cleanup(): void {
    const now = Date.now();
    const windowStart = now - this.windowSize;

    for (const [identifier, requests] of this.requests.entries()) {
      const validRequests = requests.filter(
        (timestamp) => timestamp > windowStart
      );
      if (validRequests.length === 0) {
        this.requests.delete(identifier);
      } else {
        this.requests.set(identifier, validRequests);
      }
    }
  }
}

// Initialize cleanup intervals
setInterval(cleanupReputationStore, 10 * 60 * 1000); // Every 10 minutes
