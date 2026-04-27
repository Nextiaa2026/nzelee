import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  function Input({ className, type, ...props }, ref) {
    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        className={cn(
          "h-10 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring/40 focus-visible:ring-2 focus-visible:ring-ring/15 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/15 aria-invalid:focus-visible:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50",
          className,
        )}
        {...props}
      />
    );
  },
);

export { Input };
