import Vue from 'vue';
import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';

const v = new Vue();

if (v.$config.env === 'production') {
  Raven
    .config('https://7f68fbe7ff94404c948a9314c8bc9d22@sentry.io/172496')
    .addPlugin(RavenVue, Raven)
    .install();
}
