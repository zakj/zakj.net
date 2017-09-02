module.exports = {
  build: {
    extend: function (config) {
      config.module.rules.forEach(function (rule) {
        if (rule.loader === 'vue-loader') {
          rule.options = rule.options || {};
          rule.options.cssModules = {
            localIdentName: '[local]_[hash:base64:5]',
            camelCase: true,
          };
        }
      });
    },
    postcss: [
      require('css-mqpacker')(),
      require('autoprefixer')({browsers: ['last 3 versions']}),
    ],
    vendor: ['animejs'],
  },
  css: [
    'normalize.css',
    {src: '~/assets/base.styl', lang: 'stylus'},
  ],
  generate: {
    minify: {conservativeCollapse: true},
  },
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
  plugins: [
    '~plugins/vue-config',  // first, so it can be used by other plugins
    '~plugins/components',
    '~plugins/sentry',
    '~plugins/vue-touch-events',
  ],
};
