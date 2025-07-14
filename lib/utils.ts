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
 * Generates a 9-step color scale with a Tailwind CSS-like distribution.
 *
 * @param baseColor The base color (HEX, RGB, etc.), which will serve as the '500' shade.
 * @returns An array of 9 color hex strings, from '100' (lightest) to '900' (darkest).
 */
export const generateTailwindScale = (baseColor: string): string[] => {
  const color = tinycolor(baseColor);
  if (!color.isValid()) {
    throw new Error(`Invalid base color provided: ${baseColor}`);
  }

  const baseHsl = color.toHsl();

  // --- 1. Define Endpoints ---
  // Define the characteristics of the lightest and darkest shades.
  // These are the "targets" we will interpolate towards from the base color.

  const lightTargetHsl = {
    h: baseHsl.h,
    s: 0.1, // Drastically reduce saturation for the lightest shade
    l: 0.97, // Very high lightness
  };

  // For the dark target, we apply "smart hue shifting" for better tones.
  let darkTargetHue = baseHsl.h;
  if (baseHsl.h >= 40 && baseHsl.h <= 70) {
    // Yellows -> Amber/Orange
    darkTargetHue = 35;
  }
  if (baseHsl.h >= 15 && baseHsl.h < 40) {
    // Oranges -> Deeper Orange
    darkTargetHue = 25;
  }
  if (baseHsl.h > 340 || baseHsl.h < 15) {
    // Reds -> Richer Reds
    darkTargetHue = 355;
  }

  const darkTargetHsl = {
    h: darkTargetHue,
    s: baseHsl.s > 0.1 ? 0.9 : 0.1, // Boost saturation for richness, unless it's already a grayscale color
    l: 0.12, // Very low lightness
  };

  // --- 2. Define Interpolation Steps ---
  // These are the percentages to mix the target color with the base color.
  // e.g., shade '400' is 20% of the way from the base to the light target.
  const lightMixFactors = [0.85, 0.65, 0.4, 0.2]; // For 100, 200, 300, 400
  const darkMixFactors = [0.2, 0.4, 0.6, 0.85]; // For 600, 700, 800, 900

  // --- 3. Generate the Palette ---
  const scale: string[] = [];

  // Generate lighter shades (100-400)
  lightMixFactors.forEach((factor) => {
    const newHsl = {
      h: interpolate(baseHsl.h, lightTargetHsl.h, factor),
      s: interpolate(baseHsl.s, lightTargetHsl.s, factor),
      l: interpolate(baseHsl.l, lightTargetHsl.l, factor),
    };
    scale.push(tinycolor(newHsl).toHexString());
  });

  // Add the base color (500)
  scale.push(color.toHexString());

  // Generate darker shades (600-900)
  darkMixFactors.forEach((factor) => {
    const newHsl = {
      h: interpolate(baseHsl.h, darkTargetHsl.h, factor),
      s: interpolate(baseHsl.s, darkTargetHsl.s, factor),
      l: interpolate(baseHsl.l, darkTargetHsl.l, factor),
    };
    scale.push(tinycolor(newHsl).toHexString());
  });

  return scale;
};
