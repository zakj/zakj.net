module.exports = {
  build: {
    postcss: [
      require('css-mqpacker')(),
      require('autoprefixer')({browsers: ['last 3 versions']}),
    ],
    vendor: ['animejs'],
  },
  css: [
    'normalize.css',
    {src: '~assets/base.styl', lang: 'stylus'},
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
    '~plugins/components',
    '~plugins/vue-config',
    '~plugins/vue-touch-events',
  ],
};
