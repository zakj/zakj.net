/// <reference no-default-lib="true"/>
/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

import { build, files, timestamp } from '$service-worker';

const CACHE_NAME = `zakj.net-${timestamp}`;
const ROUTES = ['/', '/plank', '/plank/']; // TODO trailing slashes
const URLS = build.concat(files, ROUTES);

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(URLS))
      .then(() => self.skipWaiting())
  );
});

function clearCaches(cacheNames: string[]) {
  return Promise.all(
    cacheNames.map((c) => {
      if (c !== CACHE_NAME) return caches.delete(c);
    })
  );
}

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then(clearCaches)
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
