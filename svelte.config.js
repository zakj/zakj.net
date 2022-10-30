import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  // TODO: add https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-custom-media
  preprocess: preprocess(),
  kit: {
    adapter: adapter(),
    prerender: { default: true },
  },
};

export default config;
