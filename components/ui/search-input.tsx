"use client";

import { SearchIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

import { Input } from "./input";

type SearchInputProps = React.ComponentProps<typeof Input>;

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, ...props }, ref) => (
    <div className="relative">
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-black/45" />
      <Input ref={ref} type="search" className={cn("pl-9", className)} {...props} />
    </div>
  ),
);

SearchInput.displayName = "SearchInput";
