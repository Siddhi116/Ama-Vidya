const CACHE_NAME = "amaVidya-cache-v1";

// Files to cache (add more if needed)
const FILES_TO_CACHE = [
  "/", // root
  "/index.html",
  "/student.html",
  "/teacher.html",
  "/main.css",
  "/student.css",
  "/teacher.css",
  "/index.css",
  "/index-8BjkvHTU.css",
  "/main.js",
  "/student.js",
  "/teacher.js",
  "/progress.js",
  "/multilang.js",
  "/games.js",
  "/en.json",
  "/od.json",
  "/student-avatar.svg",
  "/teacher-avatar.svg",
  "/manifest-D0_yXnD7.json",
  "/main.tsk"
  
];

// Install event: cache all files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event: clear old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event: serve cached files if offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request).catch(() => {
          if (event.request.destination === "document") {
            return caches.match("/index.html");
          }
        })
      );
    })
  );
});
