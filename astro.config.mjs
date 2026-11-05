import mdx from '@astrojs/mdx';
import svelte from '@astrojs/svelte';
import { defineConfig, envField } from 'astro/config';
import serviceWorker from 'astrojs-service-worker';

// https://astro.build/config
export default defineConfig({
  site: 'https://zakj.net',
  build: { format: 'file' },
  env: {
    schema: {
      IK_ENDPOINT: envField.string({
        context: 'server',
        access: 'public',
        default: 'https://ik.imagekit.io/zakj',
      }),
      IK_PRIVATE_KEY: envField.string({ context: 'server', access: 'secret' }),
    },
  },
  vite: {
    // To enable puma-dev in preview/dev mode.
    server: { allowedHosts: true },
  },
  integrations: [
    svelte(),
    // Offline support for Plank (an iOS home-screen app) and /photos. Pages always come from the
    // network, so a deploy shows on the next load; offline, Plank and Photos fall back to copies in
    // the precache, which swaps HTML and the assets it references together on each update.
    serviceWorker({
      workbox: {
        globPatterns: [
          '_astro/**',
          'fonts/**',
          'favicon.svg',
          'plank.html',
          'photos.html',
        ],
        manifestTransforms: [
          async (entries) => {
            const isPage = (entry) => entry.url.endsWith('.html');
            return {
              manifest: [
                // The precache route answers /plank with plank.html, cache first; a query keeps it
                // from matching navigations so only the fallbacks below serve these copies.
                ...entries
                  .filter(isPage)
                  .map((entry) => ({ ...entry, url: `${entry.url}?offline` })),
                // Install fetches in this order. Pages first: if a deploy lands mid-install, an
                // asset it removed 404s and the install fails, rather than storing the new
                // deploy's pages beside this one's assets.
                ...entries.filter((entry) => !isPage(entry)),
              ],
              warnings: [],
            };
          },
        ],
        runtimeCaching: [
          {
            // /photos/<id> too, which opening a photo puts in the address bar.
            urlPattern: ({ request, url }) =>
              request.mode === 'navigate' &&
              /^\/(plank|photos)(\.html|\/.*)?$/.test(url.pathname),
            handler: 'NetworkFirst',
            options: {
              networkTimeoutSeconds: 3,
              plugins: [
                {
                  // Never store pages at runtime: a stored page could outlive the assets it
                  // references.
                  cacheWillUpdate: async () => null,
                  // On timeout or network error, answer from the precache. The first match is the
                  // active worker's copy: a worker's install appends its entries, and its activate
                  // deletes everything else before it handles any fetch.
                  cachedResponseWillBeUsed: async ({
                    cachedResponse,
                    request,
                  }) =>
                    cachedResponse ??
                    caches.match(
                      new URL(request.url).pathname.startsWith('/plank')
                        ? '/plank.html'
                        : '/photos.html',
                      { ignoreSearch: true },
                    ),
                },
              ],
            },
          },
          {
            urlPattern: /^https:\/\/ik\.imagekit\.io\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'photos',
              // ImageKit allows CORS; a cors response avoids the quota padding browsers add to
              // opaque ones.
              fetchOptions: { mode: 'cors', credentials: 'omit' },
              cacheableResponse: { statuses: [200] },
              expiration: { maxEntries: 300, purgeOnQuotaError: true },
            },
          },
        ],
      },
    }),
    mdx(),
  ],
});
