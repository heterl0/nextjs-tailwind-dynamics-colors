"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { EvaColor } from "./color";
import { ColorContext } from "./color-context";

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentColor, setCurrentColor] = useState<EvaColor>({
    primary: [],
    danger: [],
    info: [],
    success: [],
    warning: [],
  });

  /**
   * Set primary color
   * @param color color #000000
   */
  const setPrimaryColor = useCallback(async (color: string) => {
    const res = await fetch(`/api/get-color?color=${color}`);
    const data = await res.json();
    setCurrentColor(data);
    localStorage.setItem("color", JSON.stringify(data));
  }, []);

  useEffect(() => {
    let colors: EvaColor | null = null;
    const colorString = localStorage.getItem("color");
    if (colorString) {
      setCurrentColor(JSON.parse(colorString));
      colors = JSON.parse(colorString) as EvaColor;
    }

    if (document && colors) {
      console.log("Have document");
      document.documentElement.style.setProperty(
        "--primary-100",
        colors?.primary[0]
      );
      document.documentElement.style.setProperty(
        "--primary-200",
        colors?.primary[1]
      );
      document.documentElement.style.setProperty(
        "--primary-300",
        colors?.primary[2]
      );
      document.documentElement.style.setProperty(
        "--primary-400",
        colors?.primary[3]
      );
      document.documentElement.style.setProperty(
        "--primary-500",
        colors?.primary[4]
      );
      document.documentElement.style.setProperty(
        "--primary-600",
        colors?.primary[5]
      );
      document.documentElement.style.setProperty(
        "--primary-700",
        colors?.primary[6]
      );
      document.documentElement.style.setProperty(
        "--primary-800",
        colors?.primary[7]
      );
      document.documentElement.style.setProperty(
        "--primary-900",
        colors?.primary[8]
      );
      document.documentElement.style.setProperty(
        "--success-100",
        colors?.success[0]
      );
      document.documentElement.style.setProperty(
        "--success-200",
        colors?.success[1]
      );
      document.documentElement.style.setProperty(
        "--success-300",
        colors?.success[2]
      );
      document.documentElement.style.setProperty(
        "--success-400",
        colors?.success[3]
      );
      document.documentElement.style.setProperty(
        "--success-500",
        colors?.success[4]
      );
      document.documentElement.style.setProperty(
        "--success-600",
        colors?.success[5]
      );
      document.documentElement.style.setProperty(
        "--success-700",
        colors?.success[6]
      );
      document.documentElement.style.setProperty(
        "--success-800",
        colors?.success[7]
      );
      document.documentElement.style.setProperty(
        "--success-900",
        colors?.success[8]
      );
      document.documentElement.style.setProperty("--info-100", colors?.info[0]);
      document.documentElement.style.setProperty("--info-200", colors?.info[1]);
      document.documentElement.style.setProperty("--info-300", colors?.info[2]);
      document.documentElement.style.setProperty("--info-400", colors?.info[3]);
      document.documentElement.style.setProperty("--info-500", colors?.info[4]);
      document.documentElement.style.setProperty("--info-600", colors?.info[5]);
      document.documentElement.style.setProperty("--info-700", colors?.info[6]);
      document.documentElement.style.setProperty("--info-800", colors?.info[7]);
      document.documentElement.style.setProperty("--info-900", colors?.info[8]);
      document.documentElement.style.setProperty(
        "--warning-100",
        colors?.warning[0]
      );
      document.documentElement.style.setProperty(
        "--warning-200",
        colors?.warning[1]
      );
      document.documentElement.style.setProperty(
        "--warning-300",
        colors?.warning[2]
      );
      document.documentElement.style.setProperty(
        "--warning-400",
        colors?.warning[3]
      );
      document.documentElement.style.setProperty(
        "--warning-500",
        colors?.warning[4]
      );
      document.documentElement.style.setProperty(
        "--warning-600",
        colors?.warning[5]
      );
      document.documentElement.style.setProperty(
        "--warning-700",
        colors?.warning[6]
      );
      document.documentElement.style.setProperty(
        "--warning-800",
        colors?.warning[7]
      );
      document.documentElement.style.setProperty(
        "--warning-900",
        colors?.warning[8]
      );
      document.documentElement.style.setProperty(
        "--danger-100",
        colors?.danger[0]
      );
      document.documentElement.style.setProperty(
        "--danger-200",
        colors?.danger[1]
      );
      document.documentElement.style.setProperty(
        "--danger-300",
        colors?.danger[2]
      );
      document.documentElement.style.setProperty(
        "--danger-400",
        colors?.danger[3]
      );
      document.documentElement.style.setProperty(
        "--danger-500",
        colors?.danger[4]
      );
      document.documentElement.style.setProperty(
        "--danger-600",
        colors?.danger[5]
      );
      document.documentElement.style.setProperty(
        "--danger-700",
        colors?.danger[6]
      );
      document.documentElement.style.setProperty(
        "--danger-800",
        colors?.danger[7]
      );
      document.documentElement.style.setProperty(
        "--danger-900",
        colors?.danger[8]
      );
    }
  }, []);

  const value = useMemo(
    () => ({ currentColor, setPrimaryColor }),
    [currentColor, setPrimaryColor]
  );

  return (
    <ColorContext.Provider value={value}>{children}</ColorContext.Provider>
  );
};

export default ThemeProvider;
