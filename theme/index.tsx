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
    const res = await fetch(`/api/get-color?theme=${color}`);
    const data: EvaColor = await res.json();
    setCurrentColor(data);

    if (document && data) {
      Object.entries(data).forEach(([colorType, colorArray]) => {
        colorArray.forEach((color, index) => {
          document.documentElement.style.setProperty(
            `--${colorType}-${(index + 1) * 100}`,
            color
          );
        });
      });
    }
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
      Object.entries(colors).forEach(([colorType, colorArray]) => {
        colorArray.forEach((color, index) => {
          document.documentElement.style.setProperty(
            `--${colorType}-${(index + 1) * 100}`,
            color
          );
        });
      });
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
