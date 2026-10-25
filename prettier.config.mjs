import config from '@zakj/prettier-config' with { type: 'json' };

// Prettier 3 no longer auto-loads plugins, so list them alongside the shared config.
export default {
  ...config,
  plugins: ['prettier-plugin-astro', 'prettier-plugin-svelte'],
};
