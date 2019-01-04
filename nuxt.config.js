import cssMqPacker from 'css-mqpacker';
import autoprefixer from 'autoprefixer';

module.exports = {
  build: {
    extend: config => {
      const svgRule = config.module.rules.find(rule => rule.test.test('.svg'));
      svgRule.test = /\.(png|jpe?g|gif|webp)$/;
      config.module.rules.push({
        test: /\.svg$/,
        loader: 'vue-svg-loader',
        options: {
          svgo: {
            plugins: [
              {cleanupIDs: false},
              {collapseGroups: false},
              {convertShapeToPath: false},
              {removeHiddenElems: false},
              {removeViewBox: false},
            ],
          },
        },
      });
    },
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
