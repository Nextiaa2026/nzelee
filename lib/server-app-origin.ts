/**
 * Canonical public origin for server-only absolute URLs (API CORS, payment callbacks, etc.).
 * `NEXT_PUBLIC_APP_URL` is the primary value on Vercel; `AUTH_URL` is the Auth.js fallback
 * and should match the same origin in production.
 */
export function serverAppOrigin(): string {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.AUTH_URL ??
    "http://localhost:3000";
  return raw.replace(/\/$/, "");
}
