"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import type { HugeiconsIconProps } from "@hugeicons/react";

import { cn } from "@/lib/utils";

export function Hugeicon({
  className,
  size = 20,
  strokeWidth = 1.5,
  ...props
}: HugeiconsIconProps) {
  return (
    <HugeiconsIcon
      className={cn("shrink-0", className)}
      size={size}
      color="currentColor"
      strokeWidth={strokeWidth}
      {...props}
    />
  );
}
