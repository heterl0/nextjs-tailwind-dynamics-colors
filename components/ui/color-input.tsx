"use client";

import { useState } from "react";
import { useColorContext } from "@/theme/use-color-context";
import { Button } from "./button";
import { Alert, AlertDescription } from "./alert";
import { Loader2, X } from "lucide-react";
import { Input } from "./input";

interface ColorInputProps {
  placeholder?: string;
  className?: string;
}

export function ColorInput({
  placeholder = "Enter hex color (e.g., #ff0000)",
  className,
}: ColorInputProps) {
  const { setPrimaryColor, error, clearError, isLoading } = useColorContext();
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear any existing errors
    clearError();

    // Remove # if present and validate hex format
    let color = inputValue.replace("#", "");

    // Basic hex validation
    const hexPattern = /^[0-9A-Fa-f]{3,6}$/;
    if (!hexPattern.test(color)) {
      // Let the API handle the detailed validation
      color = "000000"; // fallback
    }

    try {
      await setPrimaryColor(color);
      // Clear input on success
      setInputValue("");
    } catch (err) {
      // Error is already handled in the context
      console.error("Failed to set color:", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    // Clear error when user starts typing
    if (error) {
      clearError();
    }
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            disabled={isLoading}
            className="pr-10"
          />
          {inputValue && (
            <button
              type="button"
              onClick={() => {
                setInputValue("");
                clearError();
              }}
              className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <Button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="min-w-[100px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            "Set Color"
          )}
        </Button>
      </form>

      {error && (
        <Alert className="mt-4 border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
