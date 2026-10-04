/* 안심ON offline shell */
const CACHE = "ansim-on-pwa-v1";
const CORE = [
  "./assets/icons/app-icon-180.png",
  "./assets/icons/app-icon-192.png",
  "./assets/icons/app-icon-512.png",
  "./assets/icons/app-icon.svg",
  "./assets/icons/bell.svg",
  "./assets/icons/calendar.svg",
  "./assets/icons/care-activity.svg",
  "./assets/icons/care-hygiene.svg",
  "./assets/icons/care-meal.svg",
  "./assets/icons/care-toilet.svg",
  "./assets/icons/check.svg",
  "./assets/icons/chevron-down-16.svg",
  "./assets/icons/chevron-down.svg",
  "./assets/icons/chevron-left.svg",
  "./assets/icons/chevron-right.svg",
  "./assets/icons/clock-check.svg",
  "./assets/icons/file.svg",
  "./assets/icons/home.svg",
  "./assets/icons/info-circle.svg",
  "./assets/icons/logo.svg",
  "./assets/icons/menu.svg",
  "./assets/icons/message-typing.svg",
  "./assets/icons/send.svg",
  "./assets/icons/users.svg",
  "./assets/img/room-together-1.jpg",
  "./assets/img/room-together-2.jpg",
  "./css/app.css",
  "./css/ask.css",
  "./css/base.css",
  "./css/components.css",
  "./css/home.css",
  "./css/icons.css",
  "./css/list.css",
  "./css/together.css",
  "./css/tokens.css",
  "./index.html",
  "./js/app.js",
  "./js/data.js",
  "./js/pwa.js",
  "./js/store.js",
  "./js/ui.js",
  "./js/views/ask.js",
  "./js/views/home.js",
  "./js/views/records.js",
  "./js/views/together.js",
  "./manifest.webmanifest"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) {
    event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE).then((cache) => cache.put(event.request, copy));
      return response;
    }).catch(() => cached)));
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE).then((cache) => cache.put("./index.html", copy));
      return response;
    }).catch(() => caches.match("./index.html")));
    return;
  }

  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
    const copy = response.clone();
    caches.open(CACHE).then((cache) => cache.put(event.request, copy));
    return response;
  })));
});
