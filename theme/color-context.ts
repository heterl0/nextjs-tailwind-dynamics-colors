import { createContext } from "react";
import { EvaColor } from "./color";

export const ColorContext = createContext<{
  currentColor: EvaColor;
  setPrimaryColor: (color: string) => void;
}>({
  currentColor: {
    primary: [],
    danger: [],
    info: [],
    success: [],
    warning: [],
  },
  setPrimaryColor: () => {},
});
