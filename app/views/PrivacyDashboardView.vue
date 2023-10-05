<template>
  <Page>
    <ActionBar>
      <NavigationButton
        text="Home"
        android.systemIcon="ic_menu_back"
        @tap="$navigateBack"
      />
      <Label text="Privacy Dashboard" />
    </ActionBar>

    <WebView @loaded="webviewLoaded" />
  </Page>
</template>

<script lang="ts">

import {
  LoadEventData,
} from '@nativescript-community/ui-webview';

import { WebViewUtils } from 'nativescript-webview-utils';

import apiMixin from '@/mixins/apiMixin';

export default {
  mixins: [apiMixin],

  /*data() {
    return {
      webUrl: '',
    };
  },
  created() {
    this.webUrl = this.getPrivacyAddress();
  },*/
  methods: {
    webviewLoaded(args: LoadEventData) {
        const webview = args.object;
        webview.src = this.getPrivacyAddress();

        const headers: Map<string, string> = new Map();
        headers.set("Authorization", "Bearer " + this.getYggioToken());
        WebViewUtils.addHeaders(webview, headers);
    },
  },
};
</script>

<style scoped></style>
