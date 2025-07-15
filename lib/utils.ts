import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import tinycolor from "tinycolor2";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateColorScale = (baseColor: string): string[] => {
  const color = tinycolor(baseColor);
  if (!color.isValid()) {
    // Return a default or throw an error if the color is invalid
    throw new Error(`Invalid base color provided: ${baseColor}`);
  }

  const scale: string[] = [];
  const baseHsl = color.toHsl();

  // Define lightness and saturation adjustments for each step
  // These values are fine-tuned for a balanced, professional look.
  const lightnessMap = [0.95, 0.85, 0.75, 0.65, 0.55]; // For 100-500
  const saturationMap = [0.8, 0.7, 0.6, 0.5, 0.4]; // Saturation reduction for lighter shades

  // Generate shades 100-400 (Lighter)
  for (let i = 0; i < 4; i += 1) {
    scale.push(
      tinycolor({
        h: baseHsl.h,
        s: baseHsl.s * saturationMap[i],
        l: lightnessMap[i],
      }).toHexString()
    );
  }

  // Shade 500 is the base color
  scale.push(color.toHexString());

  // Generate shades 600-900 (Darker)
  for (let i = 1; i <= 4; i += 1) {
    scale.push(
      color
        .clone()
        .darken(i * 8)
        .toHexString()
    );
  }

  // Ensure we have exactly 9 shades, sometimes darken can produce duplicates at the end
  // This is a safeguard. A more robust implementation might use a different darkening algorithm.
  while (scale.length < 9) {
    scale.push(
      tinycolor(scale[scale.length - 1])
        .darken(5)
        .toHexString()
    );
  }
  if (scale.length > 9) {
    return scale.slice(0, 9);
  }

  return scale;
};

/**
 * A helper function to interpolate between two values.
 */
const interpolate = (start: number, end: number, factor: number): number => {
  return start + (end - start) * factor;
};

/**
 * Calculates a compensation factor based on the hue's inherent luminosity.
 * Yellows are naturally bright, blues are naturally dark.
 * Returns a value from -1 (dark) to 1 (bright).
 */
const getLuminosityFactor = (hue: number): number => {
  if (hue >= 70 && hue <= 180) return 0.8; // Bright Greens/Cyans
  if (hue > 50 && hue < 70) return 1; // Brightest Yellows
  if (hue >= 200 && hue <= 280) return -1; // Darkest Blues/Purples
  if (hue > 280 && hue <= 330) return -0.5; // Dark Magentas
  return 0;
};

/**
 * Generates a 9-step, perceptually uniform color scale based on advanced color principles.
 *
 * @param baseColor The base color (HEX, RGB, etc.), serving as the '500' shade.
 * @returns An array of 9 color hex strings ('100' to '900').
 */
export const generateAdvancedScale = (baseColor: string): string[] => {
  const color = tinycolor(baseColor);
  if (!color.isValid()) {
    throw new Error(`Invalid base color provided: ${baseColor}`);
  }

  const baseHsl = color.toHsl();
  const luminosityFactor = getLuminosityFactor(baseHsl.h);

  // --- 1. Define Dynamic Endpoints with Luminosity Compensation ---
  const lightTargetHsl = {
    h: baseHsl.h,
    s: baseHsl.s * 1.1 + 0.1, // Boost saturation at the lightest end
    l: 0.98 - luminosityFactor * 0.03, // Make lighter if base hue is dark, and vice versa
  };

  let darkTargetHue = baseHsl.h;
  // Apply smart hue shifting for richer dark tones
  if (baseHsl.h >= 40 && baseHsl.h <= 70) darkTargetHue = 35; // Yellows -> Amber
  if (baseHsl.h > 340 || baseHsl.h < 15) darkTargetHue = 355; // Reds -> Deeper Reds

  const darkTargetHsl = {
    h: darkTargetHue,
    s: baseHsl.s * 1.1 + 0.1, // Also boost saturation at the darkest end
    l: 0.1 + luminosityFactor * 0.05, // Make darker if base hue is bright, and vice versa
  };

  // --- 2. Define "U-Shaped" Saturation Curve ---
  // The saturation will dip in the middle and rise at the extremes.
  // These are multipliers for the interpolated saturation value.
  const saturationCurve = [1.3, 1.2, 1.1, 1, 1, 1, 1.1, 1.2, 1.3];

  // --- 3. Generate the Palette by Interpolating ---
  const scale: string[] = [];
  const mixFactors = [0.9, 0.75, 0.55, 0.25, 0, 0.25, 0.5, 0.7, 0.85];

  for (let i = 0; i < 9; i++) {
    // Shade 500 is the base color
    if (i === 4) {
      scale.push(color.toHexString());
      continue;
    }

    const isLighter = i < 4;
    const factor = mixFactors[i];
    const target = isLighter ? lightTargetHsl : darkTargetHsl;

    const h = interpolate(baseHsl.h, target.h, factor);
    let s = interpolate(baseHsl.s, target.s, factor);
    const l = interpolate(baseHsl.l, target.l, factor);

    // Apply the U-shaped saturation adjustment
    s = Math.min(1, s * saturationCurve[i]);

    scale.push(tinycolor({ h, s, l }).toHexString());
  }

  return scale;
};
