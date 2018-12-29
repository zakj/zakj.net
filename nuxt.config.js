import cssMqPacker from 'css-mqpacker';
import autoprefixer from 'autoprefixer';

module.exports = {
  build: {
    html: {
      // Defaults (nuxt doesn't merge these when changing them).
      collapseBooleanAttributes: true,
      decodeEntities: true,
      minifyCSS: true,
      minifyJS: true,
      processConditionalComments: true,
      removeEmptyAttributes: true,
      removeRedundantAttributes: true,
      trimCustomFragments: true,
      useShortDoctype: true,

      // Customizations.
      minify: {conservativeCollapse: true},
    },
    loaders: {
      cssModules: {
        camelCase: true,
      },
    },
    postcss: [
      cssMqPacker(),
      autoprefixer({browsers: ['last 3 versions']}),
    ],
  },
  css: [
    'normalize.css',
    {src: '~/assets/base.styl', lang: 'stylus'},
  ],
  head: {
    htmlAttrs: {lang: 'en'},
    link: [
      {rel: 'stylesheet', href: '//fonts.googleapis.com/css?family=PT+Serif:400,400i|Unica+One'},
    ],
    meta: [
      {name: 'charset', content: 'utf-8'},
      {name: 'viewport', content: 'initial-scale=1'},
    ],
    titleTemplate: '%s · zakj.net',
  },
  loading: false,
  modules: [
    '@nuxtjs/style-resources',
  ],
  plugins: [
    '~/plugins/vue-config',  // first, so it can be used by other plugins
    '~/plugins/components',
    '~/plugins/sentry',
    '~/plugins/vue-scrollto',
    '~/plugins/vue-touch-events',
    '~/plugins/vue-viewport-overlap',
  ],
  styleResources: {
    stylus: ['~assets/util.styl'],
  },
};
