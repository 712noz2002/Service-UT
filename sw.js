const CACHE = 'ansim-on-mobile-v2';
const CORE = [
  './', './index.html', './manifest.webmanifest',
  './css/tokens.css', './css/base.css', './css/components.css', './css/icons.css',
  './css/home.css', './css/list.css', './css/ask.css', './css/together.css', './css/app.css',
  './js/mobile.js', './js/ui.js', './js/store.js', './js/data.js',
  './js/views/home.js', './js/views/records.js', './js/views/ask.js', './js/views/together.js', './js/app.js',
  './assets/img/room-together-1.jpg', './assets/img/room-together-2.jpg',
  './assets/icons/app-icon-192.png', './assets/icons/app-icon-512.png'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(hit => hit || fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match('./index.html'))));
});
