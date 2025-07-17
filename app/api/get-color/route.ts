import { generateAdvancedScale } from "@/lib/utils";
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
    const rotateHue = (h: number, deg: number) => (h + deg + 360) % 360;
    console.log(primaryHsl.h);
    const primaryHex = tinycolor(`#${color}`).toHexString();

    const successHex = tinycolor({
      ...primaryHsl,
      h: rotateHue(primaryHsl.h, 100),
      s: 0.65,
      l: 0.5,
    }).toHexString();
    const infoHex = tinycolor({
      ...primaryHsl,
      h: rotateHue(primaryHsl.h, 180),
      s: 0.8,
      l: 0.55,
    }).toHexString();
    const warningHex = tinycolor({
      ...primaryHsl,
      h: rotateHue(primaryHsl.h, 60),
      s: 0.95,
      l: 0.5,
    }).toHexString();
    const dangerHex = tinycolor({
      ...primaryHsl,
      h: rotateHue(primaryHsl.h, -30),
      s: 0.8,
      l: 0.5,
    }).toHexString();

    // --- Generate Scales for Semantic Colors ---
    const palette: EvaColor = {
      primary: generateAdvancedScale(primaryHex),
      success: generateAdvancedScale(successHex),
      info: generateAdvancedScale(infoHex),
      warning: generateAdvancedScale(warningHex),
      danger: generateAdvancedScale(dangerHex),
    };

    return NextResponse.json(palette);
  } catch (error) {
    return NextResponse.json({
      message: "Error generating color palette.",
      error,
    });
  }
}
