const CACHE = 'iron-track-v2';

const FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon.svg',
  ...Array.from(
    { length: 20 },
    (_, i) => `./ex${String(i + 1).padStart(2, '0')}.jpg`
  )
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(FILES))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE)
          .map(key => caches.delete(key))
      )
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(
      response => response || fetch(event.request)
    )
  );
});
