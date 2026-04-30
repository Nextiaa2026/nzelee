import { format, isValid, parseISO } from "date-fns";

export function toDate(input: Date | string | number | null | undefined): Date | null {
  if (input == null) return null;
  if (input instanceof Date) return isValid(input) ? input : null;
  if (typeof input === "number") {
    const d = new Date(input);
    return isValid(d) ? d : null;
  }
  const d = parseISO(input);
  return isValid(d) ? d : null;
}

/** e.g. Apr 28, 2026 */
export function formatDateLong(input: Date | string | number | null | undefined): string {
  const d = toDate(input);
  if (!d) return "";
  return format(d, "MMM d, yyyy");
}

/**
 * e.g. Apr 28 - Jul 27, 2026 (same year shortens start).
 * Handles missing start/end with "Open" / "TBD" fallbacks.
 */
export function formatDateRange(
  start: Date | string | number | null | undefined,
  end: Date | string | number | null | undefined,
): string {
  const s = toDate(start);
  const e = toDate(end);
  if (!s && !e) return "TBD";
  if (s && !e) return `${formatDateLong(s)} - TBD`;
  if (!s && e) return `Open - ${formatDateLong(e)}`;
  if (s && e) {
    const sameYear = s.getFullYear() === e.getFullYear();
    if (sameYear) {
      return `${format(s, "MMM d")} - ${format(e, "MMM d, yyyy")}`;
    }
    return `${formatDateLong(s)} - ${formatDateLong(e)}`;
  }
  return "TBD";
}
