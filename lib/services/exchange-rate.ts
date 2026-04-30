/** ISO 4217 currencies that use zero decimal places in common retail / API usage. */
const ZERO_DECIMAL = new Set([
  "XAF",
  "XOF",
  "JPY",
  "BIF",
  "CLP",
  "DJF",
  "GNF",
  "ISK",
  "KMF",
  "KRW",
  "PYG",
  "RWF",
  "UGX",
  "VND",
  "VUV",
]);

export function currencyMinorExponent(code: string): number {
  return ZERO_DECIMAL.has(code.toUpperCase()) ? 0 : 2;
}

type OpenErLatestResponse = {
  result: string;
  base_code?: string;
  rates?: Record<string, number>;
};

/**
 * USD-based rates from open.er-api.com (free, no key).
 * Each entry is "how many units of `code` per 1 USD" (same convention as the API `rates` map).
 */
export async function getUsdRates(): Promise<Record<string, number>> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`rates ${res.status}`);
    const data = (await res.json()) as OpenErLatestResponse;
    if (data.result !== "success" || !data.rates || typeof data.rates !== "object") {
      throw new Error("invalid rates payload");
    }
    return { USD: 1, ...data.rates };
  } catch {
    return { USD: 1 };
  }
}

/**
 * Convert `amountMinor` stored in `fromCcy` minor units into minor units of `toCcy`,
 * using USD as pivot. `rates` must follow `getUsdRates()` shape (USD: 1, others per USD).
 */
export function convertMinor(
  amountMinor: number,
  fromCcy: string,
  toCcy: string,
  rates: Record<string, number>,
): number {
  const from = fromCcy.toUpperCase();
  const to = toCcy.toUpperCase();
  if (from === to) return Math.round(amountMinor);

  const expFrom = currencyMinorExponent(from);
  const expTo = currencyMinorExponent(to);
  const majorFrom = amountMinor / 10 ** expFrom;

  const rateFrom = from === "USD" ? 1 : rates[from];
  const rateTo = to === "USD" ? 1 : rates[to];
  if (rateFrom == null || rateTo == null || !Number.isFinite(rateFrom) || !Number.isFinite(rateTo)) {
    return Math.round(amountMinor);
  }

  const usdMajor = from === "USD" ? majorFrom : majorFrom / rateFrom;
  const toMajor = to === "USD" ? usdMajor : usdMajor * rateTo;
  return Math.round(toMajor * 10 ** expTo);
}
