/**
 * Client-safe max upload size (bytes). Set `NEXT_PUBLIC_MAX_UPLOAD_MB` in `.env`.
 */
export function getClientMaxUploadBytes(): number {
  const raw = process.env.NEXT_PUBLIC_MAX_UPLOAD_MB;
  const mb = raw === undefined || raw === "" ? 8 : Number(raw);
  if (!Number.isFinite(mb) || mb <= 0) return 8 * 1024 * 1024;
  return Math.floor(mb * 1024 * 1024);
}

/**
 * Server max upload (bytes). Prefer `MAX_UPLOAD_MB`; falls back to `NEXT_PUBLIC_MAX_UPLOAD_MB` then 8.
 */
export function getServerMaxUploadBytes(): number {
  const raw =
    process.env.MAX_UPLOAD_MB ??
    process.env.NEXT_PUBLIC_MAX_UPLOAD_MB ??
    "8";
  const mb = Number(raw);
  if (!Number.isFinite(mb) || mb <= 0) return 8 * 1024 * 1024;
  return Math.floor(mb * 1024 * 1024);
}
