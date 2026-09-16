"use client";

import * as React from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatMinorCurrency } from "@/lib/money";
import {
  convertMinor,
  currencyMinorExponent,
} from "@/lib/services/exchange-rate";
import { cn } from "@/lib/utils";

export const CAMPAIGN_DISPLAY_CCY_STORAGE_KEY = "campaign-display-ccy";

/** Supported display currencies (subset may be shown depending on API rates). */
export const CAMPAIGN_DISPLAY_CURRENCIES = [
  "USD",
  "XAF",
  "EUR",
  "GBP",
  "NGN",
  "GHS",
  "KES",
  "ZAR",
  "CAD",
  "JPY",
  "CNY",
] as const;

export type CampaignDisplayCurrency =
  (typeof CAMPAIGN_DISPLAY_CURRENCIES)[number];

function formatMinorIntl(amountMinor: number, currency: string): string {
  const ccy = currency.toUpperCase();
  const exp = currencyMinorExponent(ccy);
  // Amounts here are already in the display currency's minor units.
  // Scale into "cent-like" units expected by formatMinorCurrency (÷100).
  const asCents =
    exp === 2 ? amountMinor : Math.round((amountMinor / 10 ** exp) * 100);
  return formatMinorCurrency(asCents, ccy, {
    maximumFractionDigits: exp === 0 ? 0 : 2,
  });
}

type CampaignCurrencyContextValue = {
  baseCurrency: string;
  displayCurrency: string;
  setDisplayCurrency: (code: string) => void;
  /** Amount stored in campaign (base) currency minor units → display currency minor */
  convertFromBase: (amountMinorInBase: number) => number;
  formatInDisplay: (amountMinorInDisplay: number) => string;
  currencyOptions: string[];
};

const CampaignCurrencyContext =
  React.createContext<CampaignCurrencyContextValue | null>(null);

export function useCampaignDisplayCurrency() {
  const ctx = React.useContext(CampaignCurrencyContext);
  if (!ctx) {
    throw new Error(
      "useCampaignDisplayCurrency must be used within CampaignDisplayCurrencyProvider",
    );
  }
  return ctx;
}

function canPivotConvert(rates: Record<string, number>, code: string) {
  const u = code.toUpperCase();
  return u === "USD" || rates[u] != null;
}

/** True if we have USD pivot rates for both legs (required by `convertMinor`). */
function canConvertBetween(
  rates: Record<string, number>,
  from: string,
  to: string,
) {
  return canPivotConvert(rates, from) && canPivotConvert(rates, to);
}

export function CampaignDisplayCurrencyProvider({
  baseCurrency,
  rates,
  children,
}: {
  baseCurrency: string;
  rates: Record<string, number>;
  children: React.ReactNode;
}) {
  const upperBase = baseCurrency.toUpperCase();

  const currencyOptions = React.useMemo(() => {
    const out = new Set<string>();
    out.add(upperBase);
    for (const code of CAMPAIGN_DISPLAY_CURRENCIES) {
      const u = code.toUpperCase();
      if (canConvertBetween(rates, upperBase, u)) out.add(u);
    }
    return Array.from(out).sort();
  }, [rates, upperBase]);

  const [displayCurrency, setDisplayCurrencyState] = React.useState(upperBase);

  React.useEffect(() => {
    try {
      const raw = localStorage
        .getItem(CAMPAIGN_DISPLAY_CCY_STORAGE_KEY)
        ?.toUpperCase();
      if (raw && currencyOptions.includes(raw)) {
        React.startTransition(() => {
          setDisplayCurrencyState(raw);
        });
      }
    } catch {
      /* ignore */
    }
  }, [currencyOptions]);

  const setDisplayCurrency = React.useCallback(
    (code: string) => {
      const u = code.toUpperCase();
      if (!currencyOptions.includes(u)) return;
      setDisplayCurrencyState(u);
      try {
        localStorage.setItem(CAMPAIGN_DISPLAY_CCY_STORAGE_KEY, u);
      } catch {
        /* ignore */
      }
    },
    [currencyOptions],
  );

  const convertFromBase = React.useCallback(
    (amountMinorInBase: number) =>
      convertMinor(amountMinorInBase, upperBase, displayCurrency, rates),
    [displayCurrency, rates, upperBase],
  );

  const formatInDisplay = React.useCallback(
    (amountMinorInDisplay: number) =>
      formatMinorIntl(amountMinorInDisplay, displayCurrency),
    [displayCurrency],
  );

  const value = React.useMemo(
    (): CampaignCurrencyContextValue => ({
      baseCurrency: upperBase,
      displayCurrency,
      setDisplayCurrency,
      convertFromBase,
      formatInDisplay,
      currencyOptions,
    }),
    [
      convertFromBase,
      currencyOptions,
      displayCurrency,
      formatInDisplay,
      setDisplayCurrency,
      upperBase,
    ],
  );

  return (
    <CampaignCurrencyContext.Provider value={value}>
      {children}
    </CampaignCurrencyContext.Provider>
  );
}

export function CampaignCurrencyToggle({
  className,
  tone = "light",
}: {
  className?: string;
  /** `dark` = on deep-green / checkout hero surfaces */
  tone?: "light" | "dark";
}) {
  const { displayCurrency, setDisplayCurrency, currencyOptions } =
    useCampaignDisplayCurrency();

  if (currencyOptions.length <= 1) return null;

  const isDark = tone === "dark";

  return (
    <div className={className}>
      <p
        className={
          isDark
            ? "mb-1.5 text-[11px] font-medium uppercase tracking-wider text-white/85"
            : "mb-1.5 text-[11px] font-medium uppercase tracking-wider text-deep-green/55"
        }
      >
        Devise affichée
      </p>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "h-10 w-[min(100%,240px)] justify-between rounded-xl border px-3 text-sm font-medium shadow-sm",
              isDark
                ? "border-white/25 bg-white text-deep-green hover:bg-white/95 hover:text-deep-green"
                : "border-deep-green/15 bg-white text-deep-green hover:bg-neutral-50",
            )}
          >
            <span>{displayCurrency}</span>
            <ChevronDownIcon className="size-4 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="min-w-[min(100%,240px)] rounded-xl border border-deep-green/10 bg-white p-1 text-deep-green shadow-sm"
        >
          {currencyOptions.map((code) => {
            const selected = code === displayCurrency;
            return (
              <DropdownMenuItem
                key={code}
                className={cn(
                  "cursor-pointer rounded-lg px-3 py-2 focus:bg-mint/20 focus:text-deep-green",
                  selected && "bg-mint/15 font-semibold",
                )}
                onSelect={() => setDisplayCurrency(code)}
              >
                <span className="flex-1">{code}</span>
                {selected ? (
                  <CheckIcon className="size-4 text-deep-green" />
                ) : null}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
