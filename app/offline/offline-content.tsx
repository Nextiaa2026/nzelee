"use client";

import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OfflineContent() {
  return (
    <div className="text-center">
      <WifiOff className="mx-auto h-16 w-16 text-muted-foreground" />
      <h1 className="mt-6 font-display text-3xl font-bold">You&apos;re offline</h1>
      <p className="mt-3 text-muted-foreground">
        Check your internet connection and try again
      </p>
      <Button
        onClick={() => window.location.reload()}
        className="mt-6 bg-deep-green hover:bg-deep-green/90"
      >
        Try again
      </Button>
    </div>
  );
}
