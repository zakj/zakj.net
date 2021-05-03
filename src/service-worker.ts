/// <reference no-default-lib="true"/>
/// <reference lib="webworker" />

import { build, files, timestamp } from '$service-worker';

const CACHE_NAME = `zakj.net-${timestamp}`;
const URLS = ['/', '/plank', '/plank/']; // TODO trailing slashes
const FILES = build.concat(files, URLS);

self.addEventListener('install', (e: ExtendableEvent) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES)));
});

self.addEventListener('activate', (e: ExtendableEvent) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((c) => {
          if (c !== CACHE_NAME) return caches.delete(c);
        })
      );
    })
  );
});

self.addEventListener('fetch', (e: FetchEvent) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
