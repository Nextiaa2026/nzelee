"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Share } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { SITE_NAME } from "@/lib/brand";
import { BRAND_ICON_FILES } from "@/lib/brand-logos";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  
  const [isStandalone] = useState(() => {
    if (typeof window === "undefined") return false;
    const nav = navigator as NavigatorWithStandalone;
    return window.matchMedia("(display-mode: standalone)").matches 
      || nav.standalone 
      || document.referrer.includes("android-app://");
  });

  const [platform] = useState<"android" | "ios" | "other">(() => {
    if (typeof window === "undefined") return "other";
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) return "ios";
    if (/android/.test(userAgent)) return "android";
    return "other";
  });

  useEffect(() => {
    // 1. Service Worker Registration
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }

    // 2. Setup Listeners
    if (typeof window !== "undefined") {
      const userAgent = window.navigator.userAgent.toLowerCase();
      
      // 3. Listen for Install Prompt (Android/Chrome)
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        
        const isDismissed = localStorage.getItem("pwa-prompt-dismissed");
        if (!isDismissed && !isStandalone) {
          // Delay showing to not be intrusive immediately
          setTimeout(() => setShowPrompt(true), 3000);
        }
      };

      // 4. Special check for iOS (no beforeinstallprompt)
      if (/iphone|ipad|ipod/.test(userAgent) && !isStandalone) {
        const isDismissed = localStorage.getItem("pwa-prompt-dismissed");
        if (!isDismissed) {
          setTimeout(() => setShowPrompt(true), 5000);
        }
      }

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      };
    }
  }, [isStandalone]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-prompt-dismissed", "true");
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed bottom-24 left-4 right-4 z-50 md:bottom-8 md:right-8 md:left-auto md:w-[400px]"
      >
        <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/90 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] backdrop-blur-2xl dark:border-zinc-800/50 dark:bg-zinc-950/90">
          {/* Subtle Accent Glow */}
          <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="absolute -left-12 -bottom-12 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />
          
          <button
            onClick={handleDismiss}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100/50 text-zinc-500 transition-all hover:bg-zinc-200 hover:text-zinc-900 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#0b2d24] shadow-lg ring-4 ring-emerald-500/10">
              <Image
                src={BRAND_ICON_FILES.pwa192}
                alt=""
                width={56}
                height={56}
                className="h-full w-full object-cover"
              />
            </div>
            
            <div className="flex-1 pr-4">
              <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Install {SITE_NAME}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Install our app for a faster, seamless experience and easy access to your investments.
              </p>
              
              <div className="mt-6">
                {platform === "ios" ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 rounded-xl bg-zinc-50 p-3 text-xs font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-zinc-800">
                        <Share className="h-4 w-4 text-blue-500" />
                      </div>
                      <span>Tap the share button in your browser</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-zinc-50 p-3 text-xs font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-zinc-800 text-lg">
                        +
                      </div>
                      <span>Select &quot;Add to Home Screen&quot;</span>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={handleInstall}
                    className="h-11 w-full gap-2 rounded-xl bg-emerald-600 text-base font-semibold text-white transition-all hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98] dark:bg-emerald-500 dark:hover:bg-emerald-600 shadow-[0_4px_14px_0_rgba(16,185,129,0.39)]"
                  >
                    <Download className="h-5 w-5" />
                    Install Now
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
