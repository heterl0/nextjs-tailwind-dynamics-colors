"use client";

import { useState } from "react";
import tinycolor from "tinycolor2";
import { EvaColor } from "@/theme/color";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Code, Copy, Check } from "lucide-react";

interface ColorCodeDialogProps {
  currentColor: EvaColor;
  trigger?: React.ReactNode;
}

type ColorFormat = "hex" | "hsl" | "oklch";

export function ColorCodeDialog({
  currentColor,
  trigger,
}: ColorCodeDialogProps) {
  const [format, setFormat] = useState<ColorFormat>("hex");
  const [copied, setCopied] = useState(false);

  const convertColor = (color: string, targetFormat: ColorFormat): string => {
    const tc = tinycolor(color);

    switch (targetFormat) {
      case "hsl":
        const hslValues = tc.toHsl();
        return `hsl(${Math.round(hslValues.h)}deg ${Math.round(hslValues.s * 100)}% ${Math.round(hslValues.l * 100)}%)`;
      case "oklch":
        // Convert to OKLCH-like format using HSL as approximation
        // Note: This is an approximation since tinycolor2 doesn't support OKLCH
        const oklchValues = tc.toHsl();
        return `oklch(${Math.round(oklchValues.l * 100)}% ${Math.round(oklchValues.s * 100)} ${Math.round(oklchValues.h)}deg)`;
      default:
        return color;
    }
  };

  const generateCode = (): string => {
    const convertedColors: EvaColor = {
      primary: currentColor.primary.map((color) => convertColor(color, format)),
      success: currentColor.success.map((color) => convertColor(color, format)),
      info: currentColor.info.map((color) => convertColor(color, format)),
      warning: currentColor.warning.map((color) => convertColor(color, format)),
      danger: currentColor.danger.map((color) => convertColor(color, format)),
    };

    const generateCSSVariables = () => {
      const variables: string[] = [];
      Object.entries(convertedColors).forEach(([colorType, colorArray]) => {
        colorArray.forEach((color, index) => {
          const shade = (index + 1) * 100;
          variables.push(`  --${colorType}-${shade}: ${color};`);
        });
      });
      return variables.join("\n");
    };

    return `// EvaColor interface
type EvaColor = {
  primary: string[];
  danger: string[];
  info: string[];
  success: string[];
  warning: string[];
};

// Generated EvaColor object
const evaColor: EvaColor = ${JSON.stringify(convertedColors, null, 2)};

// CSS Custom Properties
:root {
${generateCSSVariables()}
}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Code className="h-4 w-4" />
            View Code
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            EvaColor Code
          </DialogTitle>
          <DialogDescription>
            Generated EvaColor object with color format options
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Format Selector */}
          <div className="flex gap-2">
            <Button
              variant={format === "hex" ? "default" : "outline"}
              size="sm"
              onClick={() => setFormat("hex")}
            >
              HEX
            </Button>
            <Button
              variant={format === "hsl" ? "default" : "outline"}
              size="sm"
              onClick={() => setFormat("hsl")}
            >
              HSL
            </Button>
            <Button
              variant={format === "oklch" ? "default" : "outline"}
              size="sm"
              onClick={() => setFormat("oklch")}
            >
              OKLCH
            </Button>
          </div>

          {/* Code Display */}
          <div className="relative">
            <div className="absolute top-2 right-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="h-8 w-8 p-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
              <code>{generateCode()}</code>
            </pre>
          </div>

          {/* Color Preview */}
          <div className="space-y-4">
            <h4 className="font-semibold">Color Preview</h4>
            <div className="grid grid-cols-5 gap-4">
              {Object.entries(currentColor).map(([colorType, colorArray]) => (
                <div key={colorType} className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-700 capitalize">
                    {colorType}
                  </h5>
                  <div className="space-y-1">
                    {colorArray.map((color, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 rounded border p-2"
                        style={{ backgroundColor: color }}
                      >
                        <div className="h-4 w-4 rounded border border-gray-300 bg-white"></div>
                        <span className="font-mono text-xs">
                          {convertColor(color, format)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
