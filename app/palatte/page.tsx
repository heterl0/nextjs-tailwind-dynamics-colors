"use client";

import { EvaColor } from "@/theme/color";
import { useCallback, useState } from "react";

const PalettePage = () => {
  const [currentTheme, setCurrentTheme] = useState<string>("#2B7FFF");

  const handleFormatValue = (value: string) => {
    if (value.startsWith("#")) {
      return value;
    }
    return `#${value}`;
  };

  const handleGenerate = useCallback(async () => {
    const response = await fetch(
      `/api/get-color?theme=${currentTheme.substring(1)}`
    );
    const colors: EvaColor = await response.json();
    if (document) {
      console.log("Have document");
      document.documentElement.style.setProperty(
        "--color-primary-100",
        colors?.primary[0]
      );
      document.documentElement.style.setProperty(
        "--color-primary-200",
        colors?.primary[1]
      );
      document.documentElement.style.setProperty(
        "--color-primary-300",
        colors?.primary[2]
      );
      document.documentElement.style.setProperty(
        "--color-primary-400",
        colors?.primary[3]
      );
      document.documentElement.style.setProperty(
        "--color-primary-500",
        colors?.primary[4]
      );
      document.documentElement.style.setProperty(
        "--color-primary-600",
        colors?.primary[5]
      );
      document.documentElement.style.setProperty(
        "--color-primary-700",
        colors?.primary[6]
      );
      document.documentElement.style.setProperty(
        "--color-primary-800",
        colors?.primary[7]
      );
      document.documentElement.style.setProperty(
        "--color-primary-900",
        colors?.primary[8]
      );
      document.documentElement.style.setProperty(
        "--color-success-100",
        colors?.success[0]
      );
      document.documentElement.style.setProperty(
        "--color-success-200",
        colors?.success[1]
      );
      document.documentElement.style.setProperty(
        "--color-success-300",
        colors?.success[2]
      );
      document.documentElement.style.setProperty(
        "--color-success-400",
        colors?.success[3]
      );
      document.documentElement.style.setProperty(
        "--color-success-500",
        colors?.success[4]
      );
      document.documentElement.style.setProperty(
        "--color-success-600",
        colors?.success[5]
      );
      document.documentElement.style.setProperty(
        "--color-success-700",
        colors?.success[6]
      );
      document.documentElement.style.setProperty(
        "--color-success-800",
        colors?.success[7]
      );
      document.documentElement.style.setProperty(
        "--color-success-900",
        colors?.success[8]
      );
      document.documentElement.style.setProperty(
        "--color-info-100",
        colors?.info[0]
      );
      document.documentElement.style.setProperty(
        "--color-info-200",
        colors?.info[1]
      );
      document.documentElement.style.setProperty(
        "--color-info-300",
        colors?.info[2]
      );
      document.documentElement.style.setProperty(
        "--color-info-400",
        colors?.info[3]
      );
      document.documentElement.style.setProperty(
        "--color-info-500",
        colors?.info[4]
      );
      document.documentElement.style.setProperty(
        "--color-info-600",
        colors?.info[5]
      );
      document.documentElement.style.setProperty(
        "--color-info-700",
        colors?.info[6]
      );
      document.documentElement.style.setProperty(
        "--color-info-800",
        colors?.info[7]
      );
      document.documentElement.style.setProperty(
        "--color-info-900",
        colors?.info[8]
      );
      document.documentElement.style.setProperty(
        "--color-warning-100",
        colors?.warning[0]
      );
      document.documentElement.style.setProperty(
        "--color-warning-200",
        colors?.warning[1]
      );
      document.documentElement.style.setProperty(
        "--color-warning-300",
        colors?.warning[2]
      );
      document.documentElement.style.setProperty(
        "--color-warning-400",
        colors?.warning[3]
      );
      document.documentElement.style.setProperty(
        "--color-warning-500",
        colors?.warning[4]
      );
      document.documentElement.style.setProperty(
        "--color-warning-600",
        colors?.warning[5]
      );
      document.documentElement.style.setProperty(
        "--color-warning-700",
        colors?.warning[6]
      );
      document.documentElement.style.setProperty(
        "--color-warning-800",
        colors?.warning[7]
      );
      document.documentElement.style.setProperty(
        "--color-warning-900",
        colors?.warning[8]
      );
      document.documentElement.style.setProperty(
        "--color-danger-100",
        colors?.danger[0]
      );
      document.documentElement.style.setProperty(
        "--color-danger-200",
        colors?.danger[1]
      );
      document.documentElement.style.setProperty(
        "--color-danger-300",
        colors?.danger[2]
      );
      document.documentElement.style.setProperty(
        "--color-danger-400",
        colors?.danger[3]
      );
      document.documentElement.style.setProperty(
        "--color-danger-500",
        colors?.danger[4]
      );
      document.documentElement.style.setProperty(
        "--color-danger-600",
        colors?.danger[5]
      );
      document.documentElement.style.setProperty(
        "--color-danger-700",
        colors?.danger[6]
      );
      document.documentElement.style.setProperty(
        "--color-danger-800",
        colors?.danger[7]
      );
      document.documentElement.style.setProperty(
        "--color-danger-900",
        colors?.danger[8]
      );
    }
  }, [currentTheme]);

  return (
    <div className="max-w-screen-lg mx-auto min-h-screen">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Palette</h1>
        </div>
        <div className="flex justify-between flex-row gap-2">
          <div className="flex flex-row gap-2">
            <input
              type="text"
              value={handleFormatValue(currentTheme)}
              onChange={(e) => setCurrentTheme(e.target.value)}
            />
            <input
              type="color"
              value={handleFormatValue(currentTheme)}
              onChange={(e) => setCurrentTheme(e.target.value)}
            />
          </div>
          <button onClick={handleGenerate}>Generate</button>
        </div>
        <div className="grid grid-cols-5 gap-2">
          <div className="flex flex-col gap-2">
            <div className="w-full h-10 bg-primary-100 text-primary-900">
              primary 100
            </div>
            <div className="w-full h-10 bg-primary-200 text-primary-900">
              primary 200
            </div>
            <div className="w-full h-10 bg-primary-300 text-primary-900">
              primary 300
            </div>
            <div className="w-full h-10 bg-primary-400 text-primary-900">
              primary 400
            </div>
            <div className="w-full h-10 bg-primary-500 text-primary-100">
              #000000
            </div>
            <div className="w-full h-10 bg-primary-600 text-primary-100">
              #000000
            </div>
            <div className="w-full h-10 bg-primary-700 text-primary-100">
              #000000
            </div>
            <div className="w-full h-10 bg-primary-800 text-primary-100">
              #000000
            </div>
            <div className="w-full h-10 bg-primary-900 text-primary-100">
              #000000
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="w-full h-10 bg-success-100 text-success-900">
              #000000
            </div>
            <div className="w-full h-10 bg-success-200 text-success-900">
              #000000
            </div>
            <div className="w-full h-10 bg-success-300 text-success-900">
              #000000
            </div>
            <div className="w-full h-10 bg-success-400 text-success-900">
              #000000
            </div>
            <div className="w-full h-10 bg-success-500 text-success-100">
              #000000
            </div>
            <div className="w-full h-10 bg-success-600 text-success-100">
              #000000
            </div>
            <div className="w-full h-10 bg-success-700 text-success-100">
              #000000
            </div>
            <div className="w-full h-10 bg-success-800 text-success-100">
              #000000
            </div>
            <div className="w-full h-10 bg-success-900 text-success-100">
              #000000
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="w-full h-10 bg-info-100 text-info-900">#000000</div>
            <div className="w-full h-10 bg-info-200 text-info-900">#000000</div>
            <div className="w-full h-10 bg-info-300 text-info-900">#000000</div>
            <div className="w-full h-10 bg-info-400 text-info-900">#000000</div>
            <div className="w-full h-10 bg-info-500 text-info-100">#000000</div>
            <div className="w-full h-10 bg-info-600 text-info-100">#000000</div>
            <div className="w-full h-10 bg-info-700 text-info-100">#000000</div>

            <div className="w-full h-10 bg-info-800 text-info-100">#000000</div>
            <div className="w-full h-10 bg-info-900 text-info-100">#000000</div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="w-full h-10 bg-warning-100 text-warning-900">
              #000000
            </div>
            <div className="w-full h-10 bg-warning-200 text-warning-900">
              #000000
            </div>
            <div className="w-full h-10 bg-warning-300 text-warning-900">
              #000000
            </div>

            <div className="w-full h-10 bg-warning-400 text-warning-900">
              #000000
            </div>
            <div className="w-full h-10 bg-warning-500 text-warning-100">
              #000000
            </div>
            <div className="w-full h-10 bg-warning-600 text-warning-100">
              #000000
            </div>
            <div className="w-full h-10 bg-warning-700 text-warning-100">
              #000000
            </div>
            <div className="w-full h-10 bg-warning-800 text-warning-100">
              #000000
            </div>
            <div className="w-full h-10 bg-warning-900 text-warning-100">
              #000000
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="w-full h-10 bg-danger-100 text-danger-900">
              #000000
            </div>

            <div className="w-full h-10 bg-danger-200 text-danger-900">
              #000000
            </div>
            <div className="w-full h-10 bg-danger-300 text-danger-900">
              #000000
            </div>
            <div className="w-full h-10 bg-danger-400 text-danger-900">
              #000000
            </div>
            <div className="w-full h-10 bg-danger-500 text-danger-100">
              #000000
            </div>
            <div className="w-full h-10 bg-danger-600 text-danger-100">
              #000000
            </div>
            <div className="w-full h-10 bg-danger-700 text-danger-100">
              #000000
            </div>
            <div className="w-full h-10 bg-danger-800 text-danger-100">
              #000000
            </div>
            <div className="w-full h-10 bg-danger-900 text-danger-100">
              #000000
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PalettePage;
