"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

import { QueryProvider } from "@/components/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { ClientOnly } from "@/components/client-only";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ClientOnly>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <QueryProvider>{children}</QueryProvider>
          <Toaster richColors closeButton position="top-center" />
        </ThemeProvider>
      </ClientOnly>
    </SessionProvider>
  );
}
