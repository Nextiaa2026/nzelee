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
};

export function CountrySelect({ id, value, onValueChange, disabled, className }: Props) {
  return (
    <Select
      value={value || undefined}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectTrigger
        id={id}
        data-slot="country-select"
        className={cn(
          "h-8 w-full min-w-0 max-w-none border-input data-[size=default]:h-8",
          className,
        )}
      >
        <SelectValue placeholder="Select your country" />
      </SelectTrigger>
      <SelectContent className="max-h-72" position="popper">
        {COUNTRY_OPTIONS.map(({ code, label }) => (
          <SelectItem key={code} value={code}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
