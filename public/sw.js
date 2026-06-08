const CACHE_NAME = "ecostep-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/manifest.json",
  "/favicon.ico"
];

// Install event: Pre-cache static shell assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Pre-caching offline app shell");
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate event: Clean up legacy caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[Service Worker] Removing old cache", cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event: Serve fresh network assets first, fallback to offline cache
self.addEventListener("fetch", (event) => {
  // Only handle standard HTTP/HTTPS requests (ignore extensions/schemes like chrome-extension://)
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Bypass API requests to allow fresh fetches (AI insights and logging actions)
  if (event.request.url.includes("/api/")) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Validate valid response to prevent caching errors
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
          return networkResponse;
        }

        // Cache newly fetched assets dynamically
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      })
      .catch(() => {
        // Safe fallback for documents when offline
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.mode === "navigate") {
            return caches.match("/");
          }
        });
      })
  );
});
