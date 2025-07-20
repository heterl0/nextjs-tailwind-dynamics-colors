# DDoS Protection Implementation

This document outlines the comprehensive DDoS protection measures implemented for the API routes in this Next.js application.

## Overview

The application implements multiple layers of DDoS protection to safeguard against various types of attacks:

1. **Rate Limiting** - Prevents excessive requests from individual IPs
2. **Input Validation** - Sanitizes and validates all incoming data
3. **Request Throttling** - Adds delays between requests from the same source
4. **IP Reputation System** - Tracks and blocks malicious IPs
5. **Security Headers** - Adds protective headers to responses
6. **Suspicious Pattern Detection** - Identifies and blocks malicious requests

## Implementation Details

### 1. Middleware Rate Limiting (`middleware.ts`)

**Features:**

- Global rate limiting for all API routes
- Configurable limits (30 requests per minute by default)
- Automatic cleanup of old rate limit records
- Development environment bypass for localhost

**Configuration:**

```typescript
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30; // 30 requests per minute
const BLOCK_DURATION = 5 * 60 * 1000; // 5 minutes block
```

### 2. API Route Protection (`app/api/get-color/route.ts`)

**Features:**

- Input validation and sanitization
- Request throttling (1 second between requests per IP)
- Enhanced error handling with proper status codes
- Security headers on responses
- Input length restrictions

**Security Headers Added:**

- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-XSS-Protection: 1; mode=block` - XSS protection
- `Cache-Control: public, max-age=3600` - Response caching

### 3. Advanced DDoS Protection (`lib/ddos-protection.ts`)

**Features:**

- IP reputation tracking system
- Suspicious pattern detection
- Sliding window rate limiting
- IP validation
- Automatic cleanup mechanisms

**Suspicious Patterns Detected:**

- Directory traversal attempts (`../`)
- XSS attempts (`<script`)
- SQL injection attempts (`union select`)
- Code injection attempts (`eval(`)

## Configuration

### Environment Variables

Add these to your `.env.local` file for production customization:

```env
# Rate limiting
RATE_LIMIT_MAX_REQUESTS=30
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_BLOCK_DURATION_MS=300000

# Throttling
THROTTLE_WINDOW_MS=1000

# IP reputation
MAX_VIOLATIONS=5
REPUTATION_DECAY_TIME_MS=1800000
```

### Customization

You can customize the protection levels by modifying the configuration objects:

```typescript
// In middleware.ts
const MAX_REQUESTS_PER_WINDOW = process.env.RATE_LIMIT_MAX_REQUESTS || 30;

// In ddos-protection.ts
export const defaultConfig: DDoSProtectionConfig = {
  maxRequestsPerMinute: 30,
  maxRequestsPerHour: 1000,
  blockDuration: 5 * 60 * 1000,
  suspiciousPatterns: [
    // Add your custom patterns here
  ],
};
```

## Production Recommendations

### 1. Use Redis for Rate Limiting

Replace the in-memory store with Redis for production:

```typescript
// Install: npm install redis
import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL,
});
```

### 2. Add Cloudflare or Similar CDN

- Use Cloudflare's DDoS protection
- Enable their rate limiting features
- Use their IP reputation lists

### 3. Monitor and Log

Add logging for security events:

```typescript
// Log rate limit violations
console.log(`Rate limit exceeded for IP: ${clientIP}`);

// Log suspicious patterns
console.log(`Suspicious pattern detected: ${pattern}`);
```

### 4. Use Environment-Specific Configurations

```typescript
const isProduction = process.env.NODE_ENV === "production";
const rateLimit = isProduction ? 30 : 1000; // Stricter in production
```

## Testing the Protection

### Test Rate Limiting

```bash
# Test rate limiting (should get 429 after 30 requests)
for i in {1..35}; do
  curl "http://localhost:3000/api/get-color?theme=ff0000"
done
```

### Test Input Validation

```bash
# Test invalid input (should get 400)
curl "http://localhost:3000/api/get-color?theme=invalid"
curl "http://localhost:3000/api/get-color?theme=12345678901234567890"
```

### Test Throttling

```bash
# Test throttling (should get 429 for rapid requests)
for i in {1..5}; do
  curl "http://localhost:3000/api/get-color?theme=ff0000" &
done
```

## Monitoring

### Key Metrics to Monitor

1. **Rate Limit Violations** - Track 429 responses
2. **Input Validation Failures** - Track 400 responses
3. **Suspicious Pattern Detections** - Log security events
4. **IP Reputation Scores** - Monitor blocked IPs
5. **Response Times** - Detect performance degradation

### Logging Example

```typescript
// Add to your API routes
const logSecurityEvent = (event: string, details: any) => {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      event,
      details,
      ip: getClientIP(request),
    })
  );
};
```

## Troubleshooting

### Common Issues

1. **False Positives** - Adjust rate limits for legitimate traffic
2. **Performance Impact** - Use Redis for better performance
3. **Memory Leaks** - Ensure cleanup functions are running
4. **Development Issues** - Check localhost bypass settings

### Debug Mode

Enable debug logging:

```typescript
const DEBUG = process.env.DEBUG_DDOS === "true";

if (DEBUG) {
  console.log(`Rate limit check for IP: ${clientIP}`);
}
```

## Security Best Practices

1. **Regular Updates** - Keep dependencies updated
2. **Monitoring** - Set up alerts for unusual traffic patterns
3. **Backup Protection** - Use multiple layers of protection
4. **Documentation** - Keep this document updated
5. **Testing** - Regularly test protection mechanisms

## Support

For issues or questions about the DDoS protection implementation:

1. Check the logs for error messages
2. Verify configuration settings
3. Test with different IP addresses
4. Review rate limiting thresholds
5. Check for conflicting middleware
