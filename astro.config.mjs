import svelte from '@astrojs/svelte';
import serviceWorker from 'astrojs-service-worker';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  build: { format: 'file' },
  integrations: [svelte(), serviceWorker()],
});
