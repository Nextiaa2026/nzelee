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
