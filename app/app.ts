import Vue from 'nativescript-vue';
import Home from './views/Home.vue';
import axios from 'axios';
import FontIcon from 'nativescript-vue-fonticon';
import RadListView from 'nativescript-ui-listview/vue';

declare let __DEV__: boolean;

axios.defaults.baseURL = 'https://yggio.sifis-home.eu/api/';

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = !__DEV__;

Vue.use(RadListView);

Vue.use(FontIcon, {
  paths: {
    fa: './fontawesome.css',
  },
});

new Vue({
  render: (h) => h('frame', [h(Home)]),
}).$start();
