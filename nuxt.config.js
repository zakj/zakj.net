module.exports = {
  build: {
    vendor: ['gsap'],
  },
  plugins: [
    '~plugins/components',
    '~plugins/vue-config',
    '~plugins/vue-touch-events',
  ],
  loading: false,
  head: {
    htmlAttrs: {lang: 'en'},
    titleTemplate: '%s · zakj.net',
    meta: [
      {name: 'charset', content: 'utf-8'},
      {name: 'viewport', content: 'initial-scale=1'},
    ],
    link: [
      {rel: 'stylesheet', href: '//fonts.googleapis.com/css?family=PT+Serif:400,400i|Unica+One'},
    ],
  },
  css: [
    'normalize.css',
    {src: '~assets/base.styl', lang: 'stylus'},
  ],
};
