import Vue from 'nativescript-vue';
import Home from './views/Home.vue';
import axios from 'axios';

declare let __DEV__: boolean;

axios.defaults.baseURL = 'https://dev.riots.fi/mobile/';

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = !__DEV__;

new Vue({
  render: (h) => h('frame', [h(Home)]),
}).$start();
