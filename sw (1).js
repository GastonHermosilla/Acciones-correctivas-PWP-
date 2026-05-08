// sw.js v4 — limpia todo el cache anterior y recarga
const CACHE = 'eng-pulling-v4';
const ASSETS = ['./', './index.html', './app.js', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => {
        console.log('Borrando cache viejo:', k);
        return caches.delete(k);
      }))
    ).then(() => self.clients.claim())
     .then(() => self.clients.matchAll())
     .then(clients => clients.forEach(c => c.navigate(c.url)))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
