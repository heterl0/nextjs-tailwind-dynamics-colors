import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import tinycolor from "tinycolor2";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * A helper function to interpolate between two hue values, taking the shortest path around the color wheel.
 */
const interpolateHue = (start: number, end: number, factor: number): number => {
  // Normalize hues to 0-360 range
  start = start % 360;
  end = end % 360;

  let diff = end - start;

  // If the difference is greater than 180, we need to go the other way
  if (diff > 180) {
    diff -= 360;
  } else if (diff < -180) {
    diff += 360;
  }

  // Interpolate and normalize to 0-360
  const result = (start + diff * factor) % 360;
  return result < 0 ? result + 360 : result;
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

    const h = interpolateHue(baseHsl.h, target.h, factor);
    let s = interpolateHue(baseHsl.s, target.s, factor);
    const l = interpolateHue(baseHsl.l, target.l, factor);

    // Apply the U-shaped saturation adjustment
    s = Math.min(1, s * saturationCurve[i]);

    scale.push(tinycolor({ h, s, l }).toHexString());
  }

  return scale;
};

export const isHueColorFallIntoSemantic = (hue: number): boolean => {
  // - **Danger Zone (Red):** Hp​ is between 345∘ and 15∘
  if (hue >= 345 && hue <= 15) return true;
  // - **Warning Zone (Yellow/Orange):** Hp​ is between 30∘ and 60∘
  if (hue >= 30 && hue <= 60) return true;
  // - **Success Zone (Green):** Hp​ is between 90∘ and 150∘
  if (hue >= 90 && hue <= 150) return true;
  // - **Info Zone (Blue):** Hp​ is between 190∘ and 250∘
  if (hue >= 190 && hue <= 250) return true;
  return false;
};

type SemanticColor = "danger" | "warning" | "success" | "info";

export const whichHueColorFallIntoSemantic = (
  hue: number
): SemanticColor | undefined => {
  // - **Danger Zone (Red):** Hp​ is between 345∘ and 15∘
  if (hue >= 345 && hue <= 15) return "danger";
  // - **Warning Zone (Yellow/Orange):** Hp​ is between 30∘ and 60∘
  if (hue >= 30 && hue <= 60) return "warning";
  // - **Success Zone (Green):** Hp​ is between 90∘ and 150∘
  if (hue >= 90 && hue <= 150) return "success";
  // - **Info Zone (Blue):** Hp​ is between 190∘ and 250∘
  if (hue >= 190 && hue <= 250) return "info";
};

export const calculateShiftColor = (hue: number): number => {
  const semanticColor: SemanticColor | undefined =
    whichHueColorFallIntoSemantic(hue);
  // don't shift
  if (!semanticColor) return 0;
  switch (semanticColor) {
    case "danger":
      if (hue >= 345) return (-hue + 345) * 2;
      return hue * 2;
    case "warning":
      return (hue - 45) * 2;
    case "success":
      return hue - 135;
    case "info":
      return hue - 210;
  }
};

export const rotateColorHex = (shift: number, color: SemanticColor): string => {
  let hue = 0;
  switch (color) {
    // Danger and Warning with shift half
    case "danger":
      hue = shift / 2;
      if (hue < 0) {
        hue = 360 + hue;
      }
      return tinycolor({
        h: hue,
        s: 0.8,
        l: 0.5,
      }).toHexString();
    case "warning":
      hue = shift / 2 + 35;
      if (hue < 0) {
        hue = 360 + hue;
      }
      return tinycolor({
        h: hue,
        s: 0.95,
        l: 0.5,
      }).toHexString();
    // Success and Info shift full cause of their ranges are double.
    case "success":
      hue = shift + 135;
      if (hue < 0) {
        hue = 360 + hue;
      }
      return tinycolor({
        h: hue,
        s: 0.65,
        l: 0.5,
      }).toHexString();
    case "info":
      hue = shift + 210;
      if (hue < 0) {
        hue = 360 + hue;
      }
      return tinycolor({
        h: hue,
        s: 0.8,
        l: 0.5,
      }).toHexString();
  }
};
