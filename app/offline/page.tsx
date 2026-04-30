import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Offline",
  description: "You are currently offline",
};

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center">
        <WifiOff className="mx-auto h-16 w-16 text-muted-foreground" />
        <h1 className="mt-6 font-display text-3xl font-bold">You're offline</h1>
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
    </main>
  );
}
