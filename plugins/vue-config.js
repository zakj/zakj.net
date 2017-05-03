import Vue from 'vue';
import VueConfig from 'vue-config';

Vue.use(VueConfig, {
  projects: process.env.NODE_ENV !== 'production',
});
