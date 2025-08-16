// API Response Wrapper Utility
// Provides consistent error handling and type validation for API responses

export interface ErrorResponse {
  error: string;
  message: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

// Type guard to check if response is an error
export function isErrorResponse(data: unknown): data is ErrorResponse {
  return (
    !!data &&
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    "message" in data
  );
}

// Generic response wrapper for handling API responses
export async function handleApiResponse<T>(
  response: Response,
  expectedType: string,
  customValidation?: (data: unknown) => data is T
): Promise<T> {
  // Check if response is ok
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    if (isErrorResponse(errorData)) {
      throw new Error(errorData.message);
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  const data = await response.json();

  // Check if the response is an error response
  if (isErrorResponse(data)) {
    throw new Error(data.message);
  }

  // Type guard to ensure data is of expected type
  if (!data || typeof data !== "object") {
    throw new Error(`Invalid response format: expected ${expectedType}`);
  }

  // Use custom validation if provided
  if (customValidation && !customValidation(data)) {
    throw new Error(`Data failed custom validation for ${expectedType}`);
  }

  return data as T;
}

// Wrapper that returns a structured response object
export async function handleApiResponseWithStructure<T>(
  response: Response,
  expectedType: string,
  customValidation?: (data: unknown) => data is T
): Promise<ApiResponse<T>> {
  try {
    const data = await handleApiResponse<T>(
      response,
      expectedType,
      customValidation
    );
    return {
      data,
      error: null,
      success: true,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return {
      data: null,
      error: errorMessage,
      success: false,
    };
  }
}

// Utility for making API calls with automatic error handling
export async function apiCall<T>(
  url: string,
  options: RequestInit = {},
  expectedType: string,
  customValidation?: (data: unknown) => data is T
): Promise<T> {
  const response = await fetch(url, options);
  return handleApiResponse<T>(response, expectedType, customValidation);
}

// Utility for making API calls with structured response
export async function apiCallWithStructure<T>(
  url: string,
  options: RequestInit = {},
  expectedType: string,
  customValidation?: (data: unknown) => data is T
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, options);
    return await handleApiResponseWithStructure<T>(
      response,
      expectedType,
      customValidation
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return {
      data: null,
      error: errorMessage,
      success: false,
    };
  }
}
