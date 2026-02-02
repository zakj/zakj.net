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
  integrations: [svelte(), serviceWorker(), mdx()],
});
