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
          "h-11 w-full min-w-0 rounded-md border-0 bg-black/4 px-3 py-2 text-sm text-foreground shadow-none transition-[color,box-shadow,background-color] outline-none file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-black/45 focus-visible:ring-2 focus-visible:ring-ring/25 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-2 aria-invalid:ring-destructive/25 aria-invalid:focus-visible:ring-destructive/30 dark:bg-white/10 dark:placeholder:text-white/45 dark:disabled:bg-white/5 dark:aria-invalid:ring-destructive/40",
          className,
        )}
        {...props}
      />
    );
  },
);

export { Input };
