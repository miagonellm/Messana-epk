// Michael Messana EPK — offline service worker
// Bump CACHE_VERSION whenever files change to force a fresh cache.
const CACHE_VERSION = 'messana-epk-v1';

// Everything the EPK needs to run fully offline.
// Relative paths resolve against the service worker's location
// (e.g. https://miagonellm.github.io/messana-epk/).
const ASSETS = [
  './',
  './messana_epk.html',
  './despondent.mp4',
  './poster.jpg',
  './despondent.mp3',
  './moments-in-time.mp3',
  './the-artist-complex.mp3',
  './watch-me.mp3',
  './uniquely-traditional.mp3',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Install: cache everything up front so first offline open works.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean out old cache versions.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first. Serve from cache; fall back to network only if missing.
// Handles range requests (audio/video seeking) by letting the browser use the
// cached full response.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
