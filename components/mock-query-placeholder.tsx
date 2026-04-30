"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
  skeletonRows?: number;
  skeletonCols?: number;
};

export function MockQueryPlaceholder({
  isPending,
  isError,
  onRetry,
  skeletonRows = 5,
  skeletonCols = 6,
}: Props) {
  if (isPending) {
    return (
      <div className="overflow-hidden rounded-md">
        <div className="grid border-b bg-white" style={{ gridTemplateColumns: `repeat(${skeletonCols}, minmax(0, 1fr))` }}>
          {Array.from({ length: skeletonCols }).map((_, idx) => (
            <div key={`head-${idx}`} className="p-3">
              <Skeleton className="h-4 w-16 bg-black/10" />
            </div>
          ))}
        </div>
        {Array.from({ length: skeletonRows }).map((_, rowIdx) => (
          <div
            key={`row-${rowIdx}`}
            className="grid border-b last:border-b-0"
            style={{ gridTemplateColumns: `repeat(${skeletonCols}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: skeletonCols }).map((__, colIdx) => (
              <div key={`cell-${rowIdx}-${colIdx}`} className="p-3">
                <Skeleton className="h-4 w-full max-w-40 bg-black/10" />
              </div>
            ))}
          </div>
        ))}
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
