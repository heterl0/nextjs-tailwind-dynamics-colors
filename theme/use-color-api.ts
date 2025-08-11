import { useState, useCallback } from "react";
import { EvaColor } from "./color";
import {
  apiCall,
  apiCallWithStructure,
  ApiResponse,
} from "../lib/api-response-wrapper";
import { toast } from "sonner";

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

export function useColorApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Method 1: Using the basic wrapper (throws on error)
  const getColorBasic = useCallback(
    async (color: string): Promise<EvaColor> => {
      setIsLoading(true);
      setError(null);

      try {
        const colorData = await apiCall<EvaColor>(
          `/api/get-color?theme=${color}`,
          {},
          "EvaColor",
          validateEvaColor
        );

        return colorData;
      } catch (e) {
        const errorMessage =
          e instanceof Error ? e.message : "An unknown error occurred";
        setError(errorMessage);
        toast.error(errorMessage);
        throw e; // Re-throw for caller to handle
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Method 2: Using the structured wrapper (returns ApiResponse object)
  const getColorStructured = useCallback(
    async (color: string): Promise<ApiResponse<EvaColor>> => {
      setIsLoading(true);
      setError(null);

      const result = await apiCallWithStructure<EvaColor>(
        `/api/get-color?theme=${color}`,
        {},
        "EvaColor",
        validateEvaColor
      );

      if (!result.success) {
        setError(result.error);
        toast.error(result.error);
      }

      setIsLoading(false);
      return result;
    },
    []
  );

  // Method 3: Using the wrapper with custom error handling
  const getColorWithCustomHandling = useCallback(
    async (color: string): Promise<EvaColor | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const colorData = await apiCall<EvaColor>(
          `/api/get-color?theme=${color}`,
          {},
          "EvaColor",
          validateEvaColor
        );

        return colorData;
      } catch (e) {
        const errorMessage =
          e instanceof Error ? e.message : "An unknown error occurred";
        setError(errorMessage);

        // Custom error handling based on error type
        if (errorMessage.includes("HTTP error! status: 429")) {
          toast.error("Too many requests. Please try again later.");
        } else if (errorMessage.includes("Invalid response format")) {
          toast.error("Server returned invalid data. Please try again.");
        } else {
          toast.error(errorMessage);
        }

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    clearError,
    getColorBasic,
    getColorStructured,
    getColorWithCustomHandling,
  };
}
