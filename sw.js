const CACHE = 'ansim-on-v5-20261004';
const CORE = [
  './','./index.html','./manifest.webmanifest',
  './css/tokens.css','./css/base.css','./css/components.css','./css/icons.css',
  './css/home.css','./css/list.css','./css/ask.css','./css/together.css','./css/app.css',
  './js/mobile.js','./js/ui.js','./js/store.js','./js/data.js','./js/app.js',
  './js/views/home.js','./js/views/records.js','./js/views/ask.js','./js/views/together.js'
];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => { const copy=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,copy)); return r; }).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
});
