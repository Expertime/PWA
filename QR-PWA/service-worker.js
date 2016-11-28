
const version = 'alpha-7';
const cacheName = `QR-PWA-${version}`;
const cdnCacheName = `QR-PWA-cdn-${version}`;
const dataCacheName = `QR-PWA-data-${version}`;
const filesToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/scripts/app.js',
  '/scripts/material.min.js',
  '/styles/style.css',
  '/styles/material.min.css',
  '/bower_components/webcomponentsjs/webcomponents.min.js',
  '/bower_components/qrjs/qr.js',
  '/bower_components/qr-code/src/qr-code.html',
  '/bower_components/qr-code/src/qr-code.js',
  '/manifest.json',
  '/images/icons/icon-144.png',
  '/images/icons/icon-192.png',
  '/images/icons/icon-512.png'
];
const cdnToCache = [
  'https://fonts.googleapis.com/',
  'https://fonts.gstatic.com/'
];
const dataToCache = [
  'https://qr-api.azurewebsites.net/'
];

self.addEventListener('install', function (e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function (e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheName && key !== cdnCacheName && key !== dataCacheName
        ) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function (e) {
    // cdn : cache-first
  if (cdnToCache.some(c => e.request.url.indexOf(c) > -1)) {
    e.respondWith(
      caches.match(e.request).then(function (response) {
        return response ||
          fetch(e.request)
            .then(function (response) {
              return caches.open(cdnCacheName).then(function (cache) {
                cache.put(e.request.url, response.clone());
                console.log('[ServiceWorker] Fetched&Cached cdnToCache', e.request.url);
                return response;
              });
            });
      })
    );
    // data : always asks for network
  } else if (dataToCache.some(c => e.request.url.indexOf(c) > -1)) {
    e.respondWith(
      caches.open(dataCacheName).then(function (cache) {
        return fetch(e.request).then(function (response) {
          cache.put(e.request.url, response.clone());
          console.log('[ServiceWorker] Fetched&Cached dataCacheName', e.request.url);
          return response;
        })
      })
    );
    // shell or anything else : cache then network
  } else {
    e.respondWith(
      caches.match(e.request).then(function (response) {
        return response || fetch(e.request);
      })
    );
  }
});
