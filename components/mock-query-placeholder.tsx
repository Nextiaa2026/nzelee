"use client";

import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
  pendingLabel?: string;
};

export function MockQueryPlaceholder({
  isPending,
  isError,
  onRetry,
  pendingLabel = "Loading…",
}: Props) {
  if (isPending) {
    return (
      <div className="flex items-center gap-2 py-12 text-sm text-muted-foreground">
        <Loader2Icon className="size-4 animate-spin" aria-hidden />
        {pendingLabel}
      </div>
    );
  }
  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
        Could not load data.{" "}
        <Button variant="link" className="h-auto p-0" type="button" onClick={() => onRetry()}>
          Retry
        </Button>
      </div>
    );
  }
  return null;
}
