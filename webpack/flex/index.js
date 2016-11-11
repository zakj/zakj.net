import Vue from 'vue';
import demo from './demo.vue';

new Vue(Object.assign({}, demo, {el: document.getElementById('root')}));
