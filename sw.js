const CACHE = 'iron-track-v5';

const INDEX_URL = new URL(
  'index.html',
  self.registration.scope
).href;

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache =>
        cache.add(new Request(INDEX_URL, { cache: 'reload' }))
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key =>
            key.startsWith('iron-track-') &&
            key !== CACHE
          )
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {

  if (event.request.method !== 'GET') return;

  if (event.request.mode === 'navigate') {

    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .then(response => {

          if (response.ok) {
            const copy = response.clone();

            caches.open(CACHE).then(cache => {
              cache.put(INDEX_URL, copy);
            });
          }

          return response;
        })
        .catch(async () => {
          const cached = await caches.match(INDEX_URL);

          return cached || Response.error();
        })
    );

  }

});
