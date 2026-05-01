"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRY_OPTIONS } from "@/lib/country-options";
import { cn } from "@/lib/utils";

type Props = {
  id?: string;
  value: string;
  onValueChange: (code: string) => void;
  disabled?: boolean;
  className?: string;
  /** Large, high-contrast control (checkout-style). */
  variant?: "default" | "checkout";
};

export function CountrySelect({
  id,
  value,
  onValueChange,
  disabled,
  className,
}: Props) {
  return (
    <Select value={value || undefined} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger
        id={id}
        data-slot="country-select"
        className={cn(
          "h-11 w-full rounded-md border-0 bg-black/4 px-3 py-2 text-sm text-foreground shadow-none transition-colors outline-none hover:bg-black/6 focus:ring-2 focus:ring-ring/25 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
      >
        <SelectValue placeholder="Select country" />
      </SelectTrigger>
      <SelectContent
        className="max-h-72 min-w-(--radix-select-trigger-width) rounded-xl border-2 border-black/10 bg-white shadow-md"
        position="popper"
      >
        {COUNTRY_OPTIONS.map(({ code, label }) => (
          <SelectItem key={code} value={code} className="py-2.5 text-[15px]">
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
