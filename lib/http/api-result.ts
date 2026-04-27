/**
 * Discriminated JSON envelope for HTTP APIs (success vs failure).
 * Prefer `ok` + `data` / `error` so clients can narrow with TypeScript.
 */
export type ApiErrorBody = {
  code: string;
  message: string;
};

export type ApiSuccess<T> = { ok: true; data: T };
export type ApiFailure = { ok: false; error: ApiErrorBody };
export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

export function apiOk<T>(data: T): ApiSuccess<T> {
  return { ok: true, data };
}

export function apiFail(code: string, message: string): ApiFailure {
  return { ok: false, error: { code, message } };
}

export function isApiSuccess<T>(r: ApiResult<T>): r is ApiSuccess<T> {
  return r.ok === true;
}

export function isApiFailure(value: unknown): value is ApiFailure {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  if (!("ok" in value) || (value as { ok: unknown }).ok !== false) {
    return false;
  }
  const err = (value as { error?: unknown }).error;
  if (typeof err !== "object" || err === null) {
    return false;
  }
  return (
    "code" in err &&
    typeof (err as { code: unknown }).code === "string" &&
    "message" in err &&
    typeof (err as { message: unknown }).message === "string"
  );
}
