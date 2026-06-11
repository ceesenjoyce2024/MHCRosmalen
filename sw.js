// Service Worker – geen caching, altijd vers van het netwerk
const CACHE_NAME = 'mhcrosmalen-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
    .then(() => self.clients.claim())
));

self.addEventListener('fetch', e => {
  // Alleen HTML/CSS/JS pagina's – Firebase calls altijd doorlaten
  const url = new URL(e.request.url);
  const isPage = url.hostname === self.location.hostname &&
    (url.pathname.endsWith('.html') || url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.pathname === '/');

  if (isPage) {
    e.respondWith(
      fetch(e.request, { cache: 'no-store' }).catch(() => caches.match(e.request))
    );
  }
});
