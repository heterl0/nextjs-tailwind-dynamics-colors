import {
  calculateShiftColor,
  generateAdvancedScale,
  isHueColorFallIntoSemantic,
  rotateColorHex,
} from "@/lib/utils";
import { EvaColor } from "@/theme/color";
import { NextRequest, NextResponse } from "next/server";
import tinycolor from "tinycolor2";

// Optimize for Vercel serverless functions
export const runtime = "nodejs";
export const maxDuration = 10;

// Input validation and sanitization
function validateColorInput(color: string): {
  isValid: boolean;
  error?: string;
} {
  // Check if color is too long (prevent buffer overflow attacks)
  if (color.length > 10) {
    return { isValid: false, error: "Color value too long" };
  }

  // Check for valid hex pattern
  const hexPattern = /^[0-9A-Fa-f]{3,6}$/;
  if (!hexPattern.test(color)) {
    return {
      isValid: false,
      error: "Invalid color format. Use 3 or 6 character hex code",
    };
  }

  return { isValid: true };
}

// Request throttling for this specific endpoint
const requestTimestamps = new Map<string, number>();
const THROTTLE_WINDOW = 1000; // 1 second between requests per IP
const CLEANUP_INTERVAL = THROTTLE_WINDOW * 10; // Cleanup entries older than 10x throttle window

function cleanupRequestTimestamps(): void {
  const now = Date.now();
  for (const [clientIP, timestamp] of requestTimestamps.entries()) {
    if (now - timestamp > CLEANUP_INTERVAL) {
      requestTimestamps.delete(clientIP);
    }
  }
}

function isThrottled(clientIP: string): boolean {
  cleanupRequestTimestamps();
  const now = Date.now();
  const lastRequest = requestTimestamps.get(clientIP);

  if (lastRequest && now - lastRequest < THROTTLE_WINDOW) {
    return true;
  }

  requestTimestamps.set(clientIP, now);
  return false;
}

// Get client IP for throttling
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  return "unknown";
}

export async function GET(request: NextRequest) {
  // Apply throttling
  const clientIP = getClientIP(request);
  if (isThrottled(clientIP)) {
    return NextResponse.json(
      {
        error: "Too many requests",
        message: "Please wait before making another request",
      },
      { status: 429 }
    );
  }

  const params = request.nextUrl.searchParams;
  const color = params.get("theme") || "000000";

  // Validate input
  const validation = validateColorInput(color);
  if (!validation.isValid) {
    return NextResponse.json(
      {
        error: "Invalid input",
        message: validation.error,
      },
      { status: 400 }
    );
  }

  if (!color || typeof color !== "string") {
    return NextResponse.json(
      {
        message: 'Missing or invalid "color" in request body.',
      },
      { status: 400 }
    );
  }

  const base = tinycolor(color);
  if (!base.isValid()) {
    return NextResponse.json(
      {
        message: `The provided color "${color}" is not a valid color.`,
      },
      { status: 400 }
    );
  }

  try {
    const primaryHsl = tinycolor(`#${color}`).toHsl();
    const primaryHex = tinycolor(`#${color}`).toHexString();

    // If the color fall into the semantic then shifting the palate color.
    if (isHueColorFallIntoSemantic(primaryHsl.h)) {
      const shift = calculateShiftColor(primaryHsl.h);

      // --- Generate Scales for Semantic Colors ---
      const palette: EvaColor = {
        primary: generateAdvancedScale(primaryHex),
        success: generateAdvancedScale(rotateColorHex(shift, "success")),
        info: generateAdvancedScale(rotateColorHex(shift, "info")),
        warning: generateAdvancedScale(rotateColorHex(shift, "warning")),
        danger: generateAdvancedScale(rotateColorHex(shift, "danger")),
      };

      const response = NextResponse.json(palette);
      // Add security headers
      response.headers.set("X-Content-Type-Options", "nosniff");
      response.headers.set("X-Frame-Options", "DENY");
      response.headers.set("X-XSS-Protection", "1; mode=block");
      response.headers.set("Cache-Control", "public, max-age=3600"); // Cache for 1 hour
      return response;
    } else {
      // Create color based on saturation and lightness of primary color
      const s = primaryHsl.s;
      const l = primaryHsl.l;
      const success = tinycolor({ s, l, h: 135 }).toHexString();
      const info = tinycolor({ s, l, h: 210 }).toHexString();
      const warning = tinycolor({ s, l, h: 45 }).toHexString();
      const danger = tinycolor({ s, l, h: 10 }).toHexString();

      const palette: EvaColor = {
        primary: generateAdvancedScale(primaryHex),
        success: generateAdvancedScale(success),
        info: generateAdvancedScale(info),
        warning: generateAdvancedScale(warning),
        danger: generateAdvancedScale(danger),
      };
      const response = NextResponse.json(palette);
      // Add security headers
      response.headers.set("X-Content-Type-Options", "nosniff");
      response.headers.set("X-Frame-Options", "DENY");
      response.headers.set("X-XSS-Protection", "1; mode=block");
      response.headers.set("Cache-Control", "public, max-age=3600"); // Cache for 1 hour
      return response;
    }
  } catch (error) {
    console.error("Error in get-color API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Error generating color palette.",
      },
      { status: 500 }
    );
  }
}
