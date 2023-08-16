<template>
  <Page ref="page">
    <ActionBar>
      <NavigationButton
        text="Back"
        android.systemIcon="ic_menu_back"
        @tap="$navigateBack"
      />
      <Label text="Policy View" />
    </ActionBar>

    <GridLayout class="page" rows="auto,*">
      <AWebView
        row="1"
        ref="webView"
        @loaded="webviewLoaded"
        :webRTC="true"
        :webConsoleEnabled="true"
        :debugMode="true"
        viewPortSize="initial-scale=1"
        enterFullscreen="enterFullscreen"
        exitFullscreen="exitFullscreen"
      ></AWebView>
    </GridLayout>
  </Page>
</template>

<script lang="ts">
import { Button, Page } from '@nativescript/core';
import {
  AWebView,
  EnterFullscreenEventData,
  LoadEventData,
  LoadFinishedEventData,
  ShouldOverrideUrlLoadEventData,
} from '@nativescript-community/ui-webview';
import { request } from '@nativescript-community/perms';
import fastEqual from 'fast-deep-equal';

let closeFullscreen: () => void;

export default {
  methods: {
    webviewLoaded(args: LoadEventData) {
      const webview = args.object;
      webview.src = 'https://sifis-proxy.riots.fi/admin_demo.html';

      webview.on(
        AWebView.shouldOverrideUrlLoadingEvent,
        (args: ShouldOverrideUrlLoadEventData) => {
          console.log(`${args.httpMethod} ${args.url}`);
          if (args.url.includes('google.com')) {
            args.cancel = true;
          }
        }
      );

      webview.on(AWebView.loadFinishedEvent, (args: LoadFinishedEventData) => {
        console.log(`WebViewExt.loadFinishedEvent: ${args.url}`);
      });

      webview.on('gotMessage', (msg) => {
        console.log(
          `webview.gotMessage: ${JSON.stringify(msg.data)} (${typeof msg})`
        );
      });

      webview.on('requestPermissions', async (args: any) => {
        // only android
        const res = await request(args.permissions[0]);
        args.callback(res[0] === 'authorized');
      });
    },
    enterFullscreen(eventData: EnterFullscreenEventData) {
      const page = this.$refs.page.nativeView as Page;
      page.actionBarHidden = true;

      closeFullscreen = eventData.exitFullscreen;

      const button = this.$refs.button.nativeView as Button;
      if (button) {
        button.visibility = 'collapse';
      }
    },

    exitFullscreen() {
      const page = this.$refs.page.nativeView as Page;
      page.actionBarHidden = false;
      const button = this.$refs.button.nativeView as Button;
      if (button) {
        button.visibility = 'visible';
      }

      closeFullscreen = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.page Label {
  font-size: 35;
  text-align: center;
  width: 100%;
  vertical-alignment: center;
  color: #ffffff;
  text-transform: uppercase;
}
</style>
