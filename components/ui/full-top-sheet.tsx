"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FullTopSheetProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  contentClassName?: string;
  bodyClassName?: string;
  bodyInnerClassName?: string;
  centerBody?: boolean;
};

function FullTopSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  contentClassName,
  bodyClassName,
  bodyInnerClassName,
  centerBody = true,
}: FullTopSheetProps) {
  // Prevent body scroll when open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => onOpenChange?.(false)}
          />
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "fixed inset-x-0 top-0 z-50 flex h-dvh flex-col overflow-y-auto bg-background shadow-2xl",
              contentClassName
            )}
          >
            <div className="flex items-center justify-between border-b px-4 py-3 sm:px-6">
              <div>
                <h2 className="font-heading text-lg font-semibold text-foreground">{title}</h2>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 rounded-full"
                onClick={() => onOpenChange?.(false)}
              >
                <XIcon className="size-5" />
                <span className="sr-only">Fermer</span>
              </Button>
            </div>

            <div
              className={cn(
                "flex min-h-0 flex-1 flex-col px-4 py-4 sm:px-6",
                centerBody && "items-center",
                bodyClassName
              )}
            >
              <div className={cn("w-full max-w-3xl", bodyInnerClassName)}>{children}</div>
            </div>

            {footer && (
              <div className="mt-auto border-t px-4 py-3 sm:px-6">{footer}</div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function FullTopSheetCancelButton(
  props: Omit<React.ComponentProps<typeof Button>, "type" | "variant"> & { onClick?: () => void },
) {
  return (
    <Button type="button" variant="outline" {...props} />
  );
}

export { FullTopSheet, FullTopSheetCancelButton };
