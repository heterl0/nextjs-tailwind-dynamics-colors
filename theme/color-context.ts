import { createContext } from "react";
import { EvaColor } from "./color";

export const ColorContext = createContext<{
  currentColor: EvaColor;
  setPrimaryColor: (color: string) => Promise<void>;
  error: string | null;
  clearError: () => void;
  isLoading: boolean;
}>({
  currentColor: {
    primary: [],
    danger: [],
    info: [],
    success: [],
    warning: [],
  },
  setPrimaryColor: async () => {},
  error: null,
  clearError: () => {},
  isLoading: false,
});
