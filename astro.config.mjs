import mdx from '@astrojs/mdx';
import svelte from '@astrojs/svelte';
import { defineConfig } from 'astro/config';
import serviceWorker from 'astrojs-service-worker';

// https://astro.build/config
export default defineConfig({
  site: 'https://zakj.net',
  build: { format: 'file' },
  integrations: [svelte(), serviceWorker(), mdx()],
});
