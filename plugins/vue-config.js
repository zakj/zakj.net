import Vue from 'vue';
import VueConfig from 'vue-config';

Vue.use(VueConfig, {
  env: process.env.NODE_ENV,
  projects: process.env.NODE_ENV !== 'production',
});
