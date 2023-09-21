import Vue from 'nativescript-vue';
import Home from './views/Home.vue';
import axios from 'axios';

import RadListView from 'nativescript-ui-listview/vue';

import WebView from '@nativescript-community/ui-webview/vue';
import { WebViewTraceCategory } from '@nativescript-community/ui-webview';
import { Trace } from '@nativescript/core';

Vue.config.silent = true;

Vue.use(RadListView);

Trace.addCategories(WebViewTraceCategory);
Trace.enable();
Vue.use(WebView);

global.myDht = [];

new Vue({
  render: (h) => h('frame', [h(Home)]),
}).$start();
