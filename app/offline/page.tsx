import type { Metadata, Viewport } from "next";
import { OfflineContent } from "./offline-content";

export const metadata: Metadata = {
  title: "Offline",
  description: "You are currently offline",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0F8261",
};

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <OfflineContent />
    </main>
  );
}
