/** Smallest unit (cents) to display USD string. */
export function formatCentsToUsd(cents: bigint | number | string | null | undefined): string {
  if (cents === null || cents === undefined) return "—";
  const n = typeof cents === "string" ? BigInt(cents) : BigInt(String(cents));
  const isNeg = n < 0n;
  const abs = isNeg ? -n : n;
  const whole = abs / 100n;
  const fraction = abs % 100n;
  const s = `${whole.toString()}.${String(fraction).padStart(2, "0")}`;
  return isNeg ? `-$${s}` : `$${s}`;
}

/**
 * Format minor currency units for UI. Uses a fixed locale so SSR and the
 * browser never disagree (avoids hydration mismatches from `undefined` locale).
 */
export function formatMinorCurrency(
  amountMinor: number,
  currency: string,
  options?: { maximumFractionDigits?: number; locale?: string },
): string {
  const ccy = (currency || "USD").toUpperCase();
  const locale = options?.locale ?? "fr-FR";
  const maximumFractionDigits = options?.maximumFractionDigits ?? 0;
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: ccy.length === 3 ? ccy : "USD",
      maximumFractionDigits,
      minimumFractionDigits: 0,
    }).format(amountMinor / 100);
  } catch {
    return `${(amountMinor / 100).toFixed(maximumFractionDigits)} ${ccy}`;
  }
}
