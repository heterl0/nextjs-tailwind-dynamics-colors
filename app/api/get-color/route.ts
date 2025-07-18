import {
  calculateShiftColor,
  generateAdvancedScale,
  rotateColorHex,
} from "@/lib/utils";
import { EvaColor } from "@/theme/color";
import { NextRequest, NextResponse } from "next/server";
import tinycolor from "tinycolor2";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const color = params.get("theme") || "000000";

  if (!color || typeof color !== "string") {
    return NextResponse.json({
      message: 'Missing or invalid "color" in request body.',
    });
  }

  const base = tinycolor(color);
  if (!base.isValid()) {
    return NextResponse.json({
      message: `The provided color "${color}" is not a valid color.`,
    });
  }

  try {
    const primaryHsl = tinycolor(`#${color}`).toHsl();
    console.log(primaryHsl.h);
    const primaryHex = tinycolor(`#${color}`).toHexString();

    const shift = calculateShiftColor(primaryHsl.h);

    // --- Generate Scales for Semantic Colors ---
    const palette: EvaColor = {
      primary: generateAdvancedScale(primaryHex),
      success: generateAdvancedScale(rotateColorHex(shift, "success")),
      info: generateAdvancedScale(rotateColorHex(shift, "info")),
      warning: generateAdvancedScale(rotateColorHex(shift, "warning")),
      danger: generateAdvancedScale(rotateColorHex(shift, "danger")),
    };

    return NextResponse.json(palette);
  } catch (error) {
    return NextResponse.json({
      message: "Error generating color palette.",
      error,
    });
  }
}
