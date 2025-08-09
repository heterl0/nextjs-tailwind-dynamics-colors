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
import Color from "colorjs.io";
import { ScrollArea } from "./scroll-area";
import CodeBlockClient from "../code-block/code-block-client";

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
        const tempColor = new Color(color);
        const oklch = tempColor.to("oklch");
        return `oklch(${oklch.coords[0].toFixed(4)} ${oklch.coords[1].toFixed(4)} ${oklch.coords[2].toFixed(4)}${oklch.alpha !== 1 ? ` ${Number(oklch.alpha.toFixed(4)) * 100}%` : ""})`;
      default:
        return color;
    }
  };

  const generateCode = (language: "css" | "typescript"): string => {
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
        variables.push(
          `  
    /* ${colorType.charAt(0).toUpperCase() + colorType.slice(1)} */`
        );
        colorArray.forEach((color, index) => {
          const shade = (index + 1) * 100;
          variables.push(`  --${colorType}-${shade}: ${color};`);
        });
      });
      return variables.join("\n");
    };

    switch (language) {
      case "css":
        return `// CSS Custom Properties
:root {
${generateCSSVariables()}
}`;
      case "typescript":
        return `// EvaColor interface
type EvaColor = {
  primary: string[];
  danger: string[];
  info: string[];
  success: string[];
  warning: string[];
};

// Generated EvaColor object
const evaColor: EvaColor = ${JSON.stringify(convertedColors, null, 2)};`;
      default:
        return "";
    }
  };

  const copyToClipboard = async (language: "css" | "typescript") => {
    try {
      await navigator.clipboard.writeText(generateCode(language));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  const handleCopyCSS = () => {
    copyToClipboard("css");
  };

  const handleCopyTS = () => {
    copyToClipboard("typescript");
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
      <DialogContent className="max-w-5xl! p-0">
        <ScrollArea className="h-full max-h-[80vh] w-full space-y-4 overflow-hidden p-4">
          <div className="space-y-4">
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
                  className="cursor-pointer"
                >
                  HEX
                </Button>
                <Button
                  variant={format === "hsl" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFormat("hsl")}
                  className="cursor-pointer"
                >
                  HSL
                </Button>
                <Button
                  variant={format === "oklch" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFormat("oklch")}
                  className="cursor-pointer"
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
                    onClick={handleCopyTS}
                    className="group h-8 w-8 cursor-pointer p-0"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-400 group-hover:text-gray-900" />
                    )}
                  </Button>
                </div>
                <CodeBlockClient
                  className="overflow-x-auto rounded-lg bg-gray-900 text-sm text-gray-100"
                  code={generateCode("typescript")}
                  language="typescript"
                />
              </div>

              <div className="relative">
                <div className="absolute top-2 right-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyCSS}
                    className="group h-8 w-8 cursor-pointer p-0"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-400 group-hover:text-gray-900" />
                    )}
                  </Button>
                </div>
                <CodeBlockClient
                  className="overflow-x-auto rounded-lg bg-gray-900 text-sm text-gray-100"
                  code={generateCode("css")}
                  language="css"
                />
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
