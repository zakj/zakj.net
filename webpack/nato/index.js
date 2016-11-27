import Vue from 'vue';
import nato from './nato.vue';
import './style.sass';

new Vue(Object.assign({}, nato, {el: document.getElementById('root')}));
