"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { EvaColor } from "./color";
import { ColorContext } from "./color-context";
import { toast } from "sonner";
import { handleApiResponse } from "../lib/api-response-wrapper";

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentColor, setCurrentColor] = useState<EvaColor>({
    primary: [],
    danger: [],
    info: [],
    success: [],
    warning: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Set primary color
   * @param color color #000000
   */
  const setPrimaryColor = useCallback(async (color: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/get-color?theme=${color}`);

      // Custom validation function for EvaColor
      const validateEvaColor = (data: unknown): data is EvaColor => {
        if (!data || typeof data !== "object") return false;
        const colorData = data as Record<string, unknown>;

        return (
          "primary" in colorData &&
          "danger" in colorData &&
          "info" in colorData &&
          "success" in colorData &&
          "warning" in colorData &&
          Array.isArray(colorData.primary) &&
          Array.isArray(colorData.danger) &&
          Array.isArray(colorData.info) &&
          Array.isArray(colorData.success) &&
          Array.isArray(colorData.warning)
        );
      };

      // Use the response wrapper with custom validation
      const colorData = await handleApiResponse<EvaColor>(
        res,
        "EvaColor",
        validateEvaColor
      );

      setCurrentColor(colorData);

      if (document && colorData) {
        Object.entries(colorData).forEach(([colorType, colorArray]) => {
          colorArray.forEach((color, index) => {
            document.documentElement.style.setProperty(
              `--${colorType}-${(index + 1) * 100}`,
              color
            );
          });
        });
      }
      localStorage.setItem("color", JSON.stringify(colorData));
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "An unknown error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error setting primary color:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    let colors: EvaColor | null = null;
    const colorString = localStorage.getItem("color");
    if (colorString) {
      try {
        const parsedColors = JSON.parse(colorString);
        setCurrentColor(parsedColors);
        colors = parsedColors as EvaColor;
      } catch (e) {
        console.error("Error parsing stored colors:", e);
        localStorage.removeItem("color"); // Clear invalid data
      }
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
    () => ({
      currentColor,
      setPrimaryColor,
      error,
      clearError,
      isLoading,
    }),
    [currentColor, setPrimaryColor, error, clearError, isLoading]
  );

  return (
    <ColorContext.Provider value={value}>{children}</ColorContext.Provider>
  );
};

export default ThemeProvider;
