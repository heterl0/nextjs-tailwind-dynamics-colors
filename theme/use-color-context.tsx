"use client";

import { useContext } from "react";
import { ColorContext } from "./color-context";

export const useColorContext = () => {
  const context = useContext(ColorContext);

  if (!context) {
    throw new Error("useColorContext must be used within a ColorContext");
  }

  return context;
};
