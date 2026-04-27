import { isAxiosError } from "axios";

import { isApiFailure, type ApiFailure } from "@/lib/http/api-result";

export function parseApiFailureFromResponseData(data: unknown): ApiFailure | null {
  if (isApiFailure(data)) {
    return data;
  }
  if (
    data &&
    typeof data === "object" &&
    "error" in data &&
    typeof (data as { error: unknown }).error === "string"
  ) {
    return {
      ok: false,
      error: {
        code: "LEGACY",
        message: (data as { error: string }).error,
      },
    };
  }
  return null;
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const structured = parseApiFailureFromResponseData(error.response?.data);
    if (structured) {
      return structured.error.message;
    }
  }
  return fallback;
}
