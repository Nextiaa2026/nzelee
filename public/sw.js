/**
 * Next.js–first PWA: optional tiny worker (not Serwist/Workbox).
 * No fetch handler — navigations and /api/auth/* always use the network.
 * Clears old third-party PWA caches once on activate.
 */
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      if (self.registration.navigationPreload) {
        try {
          await self.registration.navigationPreload.disable();
        } catch {
          /* ignore */
        }
      }
      await self.clients.claim();
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    })(),
  );
});
