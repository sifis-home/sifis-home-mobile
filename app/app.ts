import Vue from 'nativescript-vue';
import Home from './views/Home.vue';
import axios from 'axios';
import RadListView from 'nativescript-ui-listview/vue';

declare let __DEV__: boolean;

axios.defaults.baseURL = 'https://sifis.riots.fi/';

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = !__DEV__;

Vue.use(RadListView);

new Vue({
  render: (h) => h('frame', [h(Home)]),
}).$start();
