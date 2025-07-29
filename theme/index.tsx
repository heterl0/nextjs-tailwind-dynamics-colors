"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { EvaColor } from "./color";
import { ColorContext } from "./color-context";
import { toast } from "sonner";

// Define error response type
interface ErrorResponse {
  error: string;
  message: string;
}

// Type guard to check if response is an error
function isErrorResponse(data: unknown): data is ErrorResponse {
  return (
    !!data &&
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    "message" in data
  );
}

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

      // Check if the response is ok
      if (!res.ok) {
        const errorData = await res.json();
        if (isErrorResponse(errorData)) {
          toast.error(errorData.message);
          return;
        } else {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
      }

      const data = await res.json();

      // Check if the response is an error response
      if (isErrorResponse(data)) {
        throw new Error(data.message);
      }

      // Type guard to ensure data is EvaColor
      if (!data || typeof data !== "object" || !("primary" in data)) {
        throw new Error("Invalid response format from server");
      }

      const colorData: EvaColor = data;
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
